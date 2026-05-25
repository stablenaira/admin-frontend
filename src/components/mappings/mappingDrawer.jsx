import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import useApiStore from "../../stores/apiStore";
import { PillsSelector } from "./pillselector";

// Available platforms
const PLATFORMS = [
  { value: "linear", label: "Linear" },
  { value: "github", label: "GitHub" },
  { value: "jira", label: "Jira" },
  { value: "gitlab", label: "GitLab" },
];
// Mapping Form Drawer
export function MappingDrawer({ open, onClose, onSave, editData }) {
  const [platform, setPlatform] = useState(editData?.platform || "");
  const [projectId, setProjectId] = useState(editData?.projectId || "");
  const [name, setName] = useState(editData?.name || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [labels, setLabels] = useState(editData?.labels || []);
  const [events, setEvents] = useState(editData?.events || []);
  const [selectedChannels, setSelectedChannels] = useState(editData?.channels || []);

  
  // Separate state for available data from API
  const [projects, setProjects] = useState([]);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [channelsMap, setChannelsMap] = useState({});
  const [availableLabels, setAvailableLabels] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [platformSelected, setPlatformSelected] = useState("");
  
  const { fetchData, postData, putData } = useApiStore();

  // Fetch projects based on platform
  const fetchProjects = async (selectedPlatform) => {
    if (!selectedPlatform) return;
    setPlatformSelected(selectedPlatform);
        try {
          setLoadingProjects(true);
          const result = await fetchData(`/platforms/${selectedPlatform}/projects`);
          setProjects(result?.data?.data || []);
        } catch (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to fetch projects");
        } finally {
          setLoadingProjects(false);
        }
  };

  // Fetch slack channels
  const fetchSlackChannels = async () => {
    try {
      const result = await fetchData("/channels");
      const channels = result?.data?.channels || [];
      
      const channelMap = {};
      const channelNames = [];
      
      channels.forEach(ch => {
        channelMap[ch.name] = ch;
        channelNames.push(ch.name);
      });
      
      setChannelsMap(channelMap);
      setAvailableChannels(channelNames);
    } catch (error) {
      console.error("Error fetching channels:", error);
      toast.error("Failed to fetch Slack channels");
    }
  };

  // Fetch events 
  const fetchEvents = async () => {
    try {
      const result = await fetchData("/actions");
      const eventsData = result?.data?.data || [];

      console.log(eventsData, "fetched events");
      
      // Extract event names from the API response
      // Each event has structure: { id, name, action, category, resource, description, etc. }
      const eventNames = eventsData.map(ev => ev.name).filter(Boolean);
      
      setAvailableEvents(eventNames);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    }
  };

  // Fetch labels for selected project
  const fetchLabels = async (selectedPlatform) => {
    if (!selectedPlatform) return;
    
    try {
      const result = await fetchData(`/platforms/${selectedPlatform}/labels`);
      const labelNames = result?.data?.data?.map(ch => ch.name) || [];
      setAvailableLabels(labelNames);
    } catch (error) {
      console.error("Error fetching labels:", error);
      toast.error("Failed to fetch labels");
    }
  };

  useEffect(() => {
    if (open) {
      fetchSlackChannels();
      fetchEvents();
      if (platform) {
        fetchProjects(platform);
      }
      if (projectId) {
        fetchLabels(projectId);
      }
    }
  }, [open]);

  useEffect(() => {
    if (platform) {
      fetchProjects(platform);
      if (!editData) {
        setProjectId("");
        setLabels([]);
      }
    }
  }, [platform]);

  useEffect(() => {
    if (platform) {
      fetchLabels(platform);
    } else {
      setAvailableLabels([]);
    }
  }, [platform]);

  useEffect(() => {
    if (editData) {
      setPlatform(editData.platform || "");
      setProjectId(editData.projectId || "");
      setName(editData.name || "");
      setDescription(editData.description || "");
      
      if (typeof editData.labels === 'string') {
        setLabels(editData.labels ? editData.labels.split(',').map(l => l.trim()) : []);
      } else {
        setLabels(editData.labels || []);
      }
      
      if (typeof editData.events === 'string') {
        setEvents(editData.events ? editData.events.split(',').map(e => e.trim()) : []);
      } else {
        setEvents(editData.events || []);
      }
      
      if (editData.channelIds && Array.isArray(editData.channelIds)) {
        const channelNames = editData.channelIds.map(id => {
          const channel = Object.values(channelsMap).find(ch => ch.id === id);
          return channel?.name;
        }).filter(Boolean);
        setSelectedChannels(channelNames);
      } else {
        setSelectedChannels(editData.channels || []);
      }
    } else {
      setPlatform("");
      setProjectId("");
      setName("");
      setDescription("");
      setLabels([]);
      setEvents([]);
      setSelectedChannels([]);
    }
  }, [editData, open, channelsMap]);

  const handleSave = async () => {
    if (!platform) {
      toast.error("Please select a platform");
      return;
    }

    if (!projectId) {
      toast.error("Please select a project");
      return;
    }

    if (!name.trim()) {
      toast.error("Mapping name is required");
      return;
    }

    if (selectedChannels.length === 0) {
      toast.error("Please select at least one Slack channel");
      return;
    }

    const invalidChannels = selectedChannels.filter(ch => !channelsMap[ch]);
    if (invalidChannels.length > 0) {
      toast.error(`Invalid channels selected: ${invalidChannels.join(', ')}`);
      return;
    }

    const channelIds = selectedChannels.map(channelName => {
      const channel = channelsMap[channelName];
      return channel?.id;
    }).filter(Boolean);

    const mappingData = {
      platform,
      id: `${projectId}`,
      projectId,
      type: platformSelected,
      channelIds,
      name: name.trim(),
      description: description.trim(),
      labels,
      events
    };

    console.log(mappingData,"mapping data to save");

    try {
      const loadingToast = toast.loading(`${editData ? 'Updating' : 'Creating'} mapping...`);
      
      let result;
      if (editData?.id) {
        result = await putData(`/mappings/${editData.id}`, mappingData);
        toast.dismiss(loadingToast);
        toast.success("Mapping updated successfully!");
      } else {
        // filter out projectId, platform (and id) before creating
        delete mappingData.projectId;
        delete mappingData.platform;
        console.log("new body ",mappingData)
        result = await postData('/mappings', mappingData);
        toast.dismiss(loadingToast);
        toast.success("Mapping created successfully!");
      }
      console.log(result,"mapping result");
      onSave({
        ...mappingData,
        id: editData?.id || result?.data?.id || `m${Date.now()}`,
        channels: selectedChannels
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving mapping:", error);
      toast.error(`Failed to ${editData ? 'update' : 'create'} mapping: ${error?.message || 'Please try again'}`);
    }
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">{editData ? "Edit Mapping" : "New Mapping"}</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm block mb-2">Platform *</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm block mb-2">Project *</label>
              <Select 
                value={projectId} 
                onValueChange={setProjectId}
                disabled={!platform || loadingProjects}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingProjects ? "Loading projects..." : 
                    !platform ? "Select platform first" : 
                    "Select project"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project, index) => (
                    <SelectItem key={project.id || project.githubId} value={project.id || project.githubId}>
                      {project.name }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm block mb-2">Mapping Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter mapping name"
              />
            </div>

            <div>
              <label className="text-sm block mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter mapping description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm block mb-2">Labels</label>
              <PillsSelector 
                options={availableLabels} 
                selected={labels} 
                setSelected={setLabels}
                placeholder={projectId ? "Select labels" : "Select project first"}
              />
            </div>

            <div>
              <label className="text-sm block mb-2">Events *</label>
              <PillsSelector 
                options={availableEvents} 
                selected={events} 
                setSelected={setEvents}
                placeholder="Select events to trigger this mapping"
              />
            </div>

            <div>
              <label className="text-sm block mb-2">
                Slack Channels * 
                {selectedChannels.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({selectedChannels.length} selected)
                  </span>
                )}
              </label>
              <PillsSelector 
                options={availableChannels} 
                selected={selectedChannels} 
                setSelected={setSelectedChannels}
                placeholder="Select Slack channels for notifications"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleSave}
            >
              {editData ? "Update Mapping" : "Create Mapping"}
            </Button>
          </div>
        </div>
      </div>
    </>
  ); 
}