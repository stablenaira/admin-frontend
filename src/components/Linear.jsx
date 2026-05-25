import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/inpute";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, X, Edit, Trash, ArrowLeft, Settings, FolderOpen, RefreshCcw,  ExternalLink, Star } from "lucide-react";
import { toast } from "sonner";
import useApiStore from "../stores/apiStore";
import { Progress } from "../components/ui/progress";
import {decimalToPercentage} from "../utility/decimimalToPercentage"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";

// import { LinearWorkFlow } from "./LinearWorkflow";

// Mock data for mappings
const mockMappings = {
  "p1": [
    {
      id: "m1",
      projectId: "p1",
      name: "Frontend Issues Mapping",
      description: "Maps frontend issues to development channel",
      labels: ["Frontend", "Bug", "Feature"],
      events: ["Issue Created", "Issue Closed"],
      channels: ["#frontend-dev", "#general"]
    },
    {
      id: "m2", 
      projectId: "p1",
      name: "Critical Alerts Mapping",
      description: "High priority issues routing",
      labels: ["Critical", "Bug"],
      events: ["Issue Created"],
      channels: ["#alerts", "#management"]
    }
  ],
  "p2": [
    {
      id: "m3",
      projectId: "p2", 
      name: "Backend Issues Mapping",
      description: "Backend service issues and API problems",
      labels: ["Backend", "API", "Database"],
      events: ["Issue Created", "Issue Labeled"],
      channels: ["#backend-dev", "#devops"]
    }
  ],
  "p3": []
};

// Available options for mappings
const availableLabels = ["Frontend", "Backend", "Bug", "Feature", "Critical", "API", "Database", "Mobile", "UI/UX"];
const availableEvents = ["Issue Created", "Issue Closed", "Issue Labeled", "Issue Assigned", "Issue Reopened"];
const availableChannels = ["#general", "#frontend-dev", "#backend-dev", "#mobile-dev", "#alerts", "#management", "#devops"];

// Pills Selector Component
function PillsSelector({ options, selected, setSelected, placeholder }) {
  const toggleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((o) => o !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
        {selected.length === 0 ? (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        ) : (
          selected.map((item) => (
            <Badge
              key={item}
              className="cursor-pointer bg-primary text-primary-foreground"
              onClick={() => toggleSelect(item)}
            >
              {item} <X className="ml-1 h-3 w-3" />
            </Badge>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.filter(opt => !selected.includes(opt)).map((opt) => (
          <Badge
            key={opt}
            onClick={() => toggleSelect(opt)}
            className="cursor-pointer bg-muted hover:bg-muted/80"
          >
            {opt}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Project Form Drawer
function ProjectDrawer({ open, onClose, onSave, editData }) {
  const [name, setName] = useState(editData?.name || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [status, setStatus] = useState(editData?.status || "active");
  const { data, loading, error, fetchData, postData, putData, deleteData } = useApiStore();

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      setStatus(editData.status || "active");
    } else {
      setName("");
      setDescription("");
      setStatus("active");
    }
  }, [editData, open]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    // Only send name and description
    const projectPayload = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      await putData(`/mappings/projects/${editData?.id}`, projectPayload);
      fetchData("/mappings/projects")
      onClose();
    } catch (err) {
      toast.error("Failed to update project. " + (err?.message || error));
    }
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">{editData ? "Edit Project" : "New Project"}</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Project Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleSave}>
              {editData ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Mapping Form Drawer
function MappingDrawer({ open, onClose, onSave, editData, projectId }) {
  const [name, setName] = useState(editData?.name || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [labels, setLabels] = useState(editData?.labels || []);
  const [events, setEvents] = useState(editData?.events || []);
  const [selectedChannels, setSelectedChannels] = useState(editData?.channels || []);
  
  // Separate state for available data from API
  const [availableChannels, setAvailableChannels] = useState([]);
  const [channelsMap, setChannelsMap] = useState({});
  const [availableLabels, setAvailablelabels] = useState([]);
  const [availableEvents, setAvailableEvents] = useState(['create','update','remove']);
  
  const { data, loading, error, fetchData, postData, putData, deleteData } = useApiStore();

  // Fetch slack channels
  const fetchSlackChannels = async() => {
    try {
      const result = await fetchData(`/channels`);
      console.log(result.data.channels, "fetched channels");
      
      const channels = result?.data?.channels || [];
      
      // Create a map by channel name for easy lookup
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
  }

  // Fetch labels
  const fetchLabels = async() => {
    try {
      const result = await fetchData(`/projects/${projectId}/labels`);
      console.log(result.data.data, "labels");
      
      // Transform labels objects to just names for PillsSelector
      const labelNames = result?.data?.data?.map(ch => ch.name) || [];
      setAvailablelabels(labelNames);
    } catch (error) {
      console.error("Error fetching labels:", error);
      toast.error("Failed to fetch labels");
    }
  }

  useEffect(() => {
    if (open) {
      fetchSlackChannels();
      fetchLabels();

    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      
      // Handle labels - convert string to array or use array
      if (typeof editData.labels === 'string') {
        setLabels(editData.labels ? editData.labels.split(',').map(l => l.trim()) : []);
      } else {
        setLabels(editData.labels || []);
      }
      
      // Handle events - convert string to array or use array
      if (typeof editData.events === 'string') {
        setEvents(editData.events ? editData.events.split(',').map(e => e.trim()) : []);
      } else {
        setEvents(editData.events || []);
      }
      
      // Handle channels - convert channelIds to channel names if needed
      if (editData.channelIds && Array.isArray(editData.channelIds)) {
        // Find channel names from IDs
        const channelNames = editData.channelIds.map(id => {
          const channel = Object.values(channelsMap).find(ch => ch.id === id);
          return channel?.name;
        }).filter(Boolean);
        setSelectedChannels(channelNames);
      } else {
        setSelectedChannels(editData.channels || []);
      }
    } else {
      setName("");
      setDescription("");
      setLabels([]);
      setEvents([]); // Default to all events
      setSelectedChannels([]);
    }
  }, [editData, open, channelsMap]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Mapping name is required");
      return;
    }

    if (selectedChannels.length === 0) {
      toast.error("Please select at least one Slack channel");
      return;
    }

    // Validate all selected channels exist
    const invalidChannels = selectedChannels.filter(ch => !channelsMap[ch]);
    if (invalidChannels.length > 0) {
      toast.error(`Invalid channels selected: ${invalidChannels.join(', ')}`);
      return;
    }

    // Convert selected channel names to IDs
    const channelIds = selectedChannels.map(channelName => {
      const channel = channelsMap[channelName];
      return channel?.id;
    }).filter(Boolean);

    // Format data according to backend requirements
    const mappingData = {
      projectId,
      channelIds: channelIds,
      name: name.trim(),
      description: description.trim(),
      labels: labels, // Convert array to comma-separated string
      // events: events.join(',')  // Convert array to comma-separated string
      events: events // Convert array to comma-separated string
    };

    console.log("Sending mapping data to backend:", mappingData);

    try {
      const loadingToast = toast.loading(`${editData ? 'Updating' : 'Creating'} mapping...`);
      
      let result;
      if (editData?.id) {
        // Update existing mapping
        result = await putData(`/mappings`, mappingData);
        console.log(result, "result from put");
        toast.dismiss(loadingToast);
        toast.success("Mapping updated successfully!");
      } else {
        // Create new mapping
        result = await postData('/mappings', mappingData);
        console.log(result, "result from post");
        toast.dismiss(loadingToast);
        toast.success("Mapping created successfully!");
      }
      
      console.log("Backend response:", result);
      
      // Call parent onSave callback with the data including channel names for display
      onSave({
        ...mappingData,
        id: editData?.id || result?.data?.id || `m${Date.now()}`,
        labels: labels, // Keep as array for display
        events: events, // Keep as array for display
        channels: selectedChannels // Keep channel names for display
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving mapping:", error);
      toast.error(`Failed to ${editData ? 'update' : 'create'} mapping: ${error?.message || 'Please try again'}`);
    }
  };

  console.log("Current editData:", editData);
  console.log("Selected channels:", selectedChannels);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">{editData ? "Edit Mapping" : "New Mapping"}</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium block mb-2">Mapping Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter mapping name"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter mapping description"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Labels</label>
              <PillsSelector 
                options={availableLabels} 
                selected={labels} 
                setSelected={setLabels}
                placeholder="Select labels for this mapping"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Events *</label>
              <PillsSelector 
                options={availableEvents} 
                selected={events} 
                setSelected={setEvents}
                placeholder="Select events to trigger this mapping"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
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
              disabled={loading}
            >
              {loading ? "Saving..." : (editData ? "Update Mapping" : "Create Mapping")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function LinearWorkFlow() {
  const [projects, setProjects] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [mappingDrawerOpen, setMappingDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingMapping, setEditingMapping] = useState(null);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const { data, loading, error, fetchData, postData, putData, deleteData } = useApiStore();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    projectId: null,
    projectName: null
  });

  const confirmDeleteProject = (id, name) => {
    setDeleteConfirmation({
      open: true,
      projectId: id,
      projectName: name
    });
  };

  // Project CRUD operations
  const handleSaveProject = () => {};

  useEffect(() => {
    fetchData("/projects");
  }, []);

  // Handle data processing and UI feedback
  useEffect(() => {
    // Handle successful data loading
    if (data && !loading && !error) {
      // Ensure projects is always an array
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else if (data && Array.isArray(data.data)) {
        setProjects(data.data);
      }
      toast.success("Projects fetched successfully!");
    }

    // Handle error state
    if (error) {
      toast.error("Failed to fetch projects");
    }
  }, [data, loading, error]);

  const handleDeleteProject = async (id, projectName) => {
    // Store original state for rollback if needed
    const originalProjects = projects;
    const originalMappings = mappings;
    const originalSelectedProject = selectedProject;

    try {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      
      // Remove mappings for this project
      setMappings([]);
      
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }

      const loadingToast = toast.loading('Deleting project...');

      await deleteData(`/mappings/projects/${id}`);
      
      toast.dismiss(loadingToast);
      toast.success(
        projectName 
          ? `Project "${projectName}" deleted successfully!` 
          : 'Project deleted successfully!'
      );

    } catch (error) {
      // Rollback optimistic updates on error
      setProjects(originalProjects);
      setMappings(originalMappings);
      setSelectedProject(originalSelectedProject);
      
      // Show error toast
      console.error('Failed to delete project:', error);
      toast.error(
        `Failed to delete project. ${error?.message || 'Please try again.'}`
      );
    }
  };

  //  Refresh mappings from backend
  const refreshMappings = async (projectId) => {
    try {
      setLoadingMappings(true);
      const result = await fetchData(`/mappings/${projectId}`);
      console.log("Refreshed mappings result:", result);
      
      // Handle different possible API response structures
      let fetchedMappings = [];
      
      if (Array.isArray(result)) {
        fetchedMappings = result;
      } else if (result?.data?.channels && Array.isArray(result.data.channels)) {
        fetchedMappings = result.data.channels;
      } else if (result?.channels && Array.isArray(result.channels)) {
        fetchedMappings = result.channels;
      } else if (result?.data && Array.isArray(result.data)) {
        fetchedMappings = result.data;
      }
      
      console.log("Fetched mappings:", fetchedMappings);
      setMappings(fetchedMappings);
      
      return fetchedMappings;
    } catch (error) {
      console.error("Error refreshing mappings:", error);
      setMappings([]);
      throw error;
    } finally {
      setLoadingMappings(false);
    }
  };

  // FIXED: Mapping save with proper refresh
  const handleSaveMapping = async (mapping) => {
    const loadingToast = toast.loading(mapping.id ? 'Updating mapping...' : 'Creating mapping...');
    
    try {
      // The mapping drawer should have already sent the data to backend
      // Now refresh the mappings list from backend
      await refreshMappings(selectedProject.id);
      
      toast.dismiss(loadingToast);
      toast.success(`Mapping ${mapping.id ? "updated" : "created"} successfully!`);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error saving mapping:', error);
      toast.error(`Failed to ${mapping.id ? "update" : "create"} mapping. Please try again.`);
    }
  };

  // FIXED: Mapping delete with proper refresh
  const handleDeleteMapping = async (mappingId, projectId) => {
    const loadingToast = toast.loading('Deleting mapping...');
    
    try {
      await deleteData(`/mappings/${projectId}/${mappingId}`);
      
      // Refresh mappings from backend after delete
      await refreshMappings(projectId);
      
      toast.dismiss(loadingToast);
      toast.success("Mapping deleted successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error deleting mapping:', error);
      toast.error("Failed to delete mapping. " + (error?.message || "Please try again."));
    }
  };

  const handleSync = () => {
    setTimeout(() => {
      fetchData("/projects");
    }, 3000);
    
    console.log("refreshed");
  };

  // FIXED: Fetch all mappings for a selected project
  const handleselectedPro = async (project) => {
    setSelectedProject(project);
    setLoadingMappings(true);
    
    try {
      const result = await fetchData(`/mappings/${project.id}`);
      console.log("Full API result:", result);
      
      // Handle different possible API response structures
      let fetchedMappings = [];
      
      if (Array.isArray(result)) {
        fetchedMappings = result;
      } else if (result?.data?.channels && Array.isArray(result.data.channels)) {
        fetchedMappings = result.data.channels;
      } else if (result?.channels && Array.isArray(result.channels)) {
        fetchedMappings = result.channels;
      } else if (result?.data && Array.isArray(result.data)) {
        fetchedMappings = result.data;
      }
      
      console.log("Fetched mappings:", fetchedMappings);
      setMappings(fetchedMappings);
      
      if (fetchedMappings.length > 0) {
        toast.success(`${fetchedMappings.length} mapping(s) loaded successfully!`);
      }
    } catch (error) {
      console.error("Error fetching mappings:", error);
      setMappings([]);
      toast.error("Failed to fetch mappings");
    } finally {
      setLoadingMappings(false);
    }
  };

  // Render projects list
  if (!selectedProject) {
    return (
      <div className="p-6">
        <AlertDialog 
          open={deleteConfirmation.open} 
          onOpenChange={(open) => 
            setDeleteConfirmation({ open, projectId: null, projectName: null })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project 
                <strong className="text-foreground"> "{deleteConfirmation.projectName}"</strong> and 
                all its associated mappings. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive rounded-md p-2 text-sm text-destructive-foreground hover:bg-destructive/90"
                onClick={() => 
                  handleDeleteProject(
                    deleteConfirmation.projectId, 
                    deleteConfirmation.projectName
                  )
                }
              >
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl">Linear Projects</h1>
            <p className="text-muted-foreground">Manage your Linear projects and their Slack integrations</p>
          </div>
          <Button onClick={() => { fetchData("/projects"); }}>
            {loading ? "Loading..." : <><RefreshCcw className="w-4 h-4 mr-2" /> Sync</>}
          </Button>
        </div>

        {!projects || projects.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              No projects available. Please sync to fetch projects.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {Array.isArray(projects) && projects.map((project) => (
              <Card 
                key={project.id || project.name || Math.random()} 
                className="p-6 hover:shadow-md transition-shadow"
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleselectedPro(project)}
                      >
                        {project.name}
                      </h2>
                      <Badge 
                        variant={
                          project.state === "completed" ? "default" : 
                          project.state === "started" ? "secondary" : 
                          "outline"
                        }
                        className={
                          project.state === "completed" ? "bg-green-500 hover:bg-green-600" :
                          project.state === "started" ? "bg-blue-500 hover:bg-blue-600" :
                          project.state === "planned" ? "bg-purple-500 hover:bg-purple-600" :
                          ""
                        }
                      >
                        {project.state}
                      </Badge>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    
                    {/* Priority Display */}
                    {project.priority !== undefined && (
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground mr-1">Priority:</span>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < project.priority 
                                  ? "fill-yellow-500 text-yellow-500" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {project.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{decimalToPercentage(project.progress)}</span>
                        </div>
                        <Progress value={decimalToPercentage(project.progress, 0, false)} className="h-2" />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setEditingProject(project); 
                        setProjectDrawerOpen(true); 
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        confirmDeleteProject(project.id, project.name);
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <ProjectDrawer
          open={projectDrawerOpen}
          onClose={() => setProjectDrawerOpen(false)}
          onSave={handleSaveProject}
          editData={editingProject}
        />
      </div>
    );
  }

  // Render project mappings
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedProject(null)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl">{selectedProject.name}</h1>
          <p className="text-muted-foreground">{selectedProject.description}</p>
        </div>
        <Button onClick={() => { setEditingMapping(null); setMappingDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Mapping
        </Button>
      </div>

      {loadingMappings ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading mappings...</p>
        </Card>
      ) : !Array.isArray(mappings) || mappings.length === 0 ? (
        <Card className="p-8 text-center">
          <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No mappings configured</h3>
          <p className="text-muted-foreground mb-4">
            Create your first mapping to connect Linear issues with Slack channels
          </p>
          <Button onClick={() => { setEditingMapping(null); setMappingDrawerOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Mapping
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mappings.map((mapping, index) => (
            <Card key={mapping.id || mapping.channelId || index} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="mb-2">
                    {mapping.name || mapping.channelName || 'Unnamed Mapping'}
                  </h2>
                  {mapping.description && (
                    <p className="text-muted-foreground mb-4">{mapping.description}</p>
                  )}
                  
                  <div className="space-y-3">
                    {/* Channel Info */}
                    {mapping.channelName && (
                      <div>
                        <span className="text-sm">Channel: </span>
                        <Badge className="bg-green-100 text-green-800">
                          {mapping.channelName}
                        </Badge>
                        {mapping.isPrivate && (
                          <Badge variant="outline" className="ml-2">Private</Badge>
                        )}
                      </div>
                    )}

                    {/* Channel ID */}
                    {mapping.channelId && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          ID: {mapping.channelId}
                        </span>
                      </div>
                    )}

                    {/* Labels - if they exist */}
                    {mapping.labels && Array.isArray(mapping.labels) && mapping.labels.length > 0 && (
                      <div>
                        <span className="text-sm">Labels: </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {mapping.labels.map((label, idx) => (
                            <Badge key={idx} variant="outline">{label}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Events - if they exist */}
                    {mapping.events && Array.isArray(mapping.events) && mapping.events.length > 0 && (
                      <div>
                        <span className="text-sm">Events: </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {mapping.events.map((event, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800">{event}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Multiple Channels - if they exist as array */}
                    {mapping.channels && Array.isArray(mapping.channels) && mapping.channels.length > 0 && (
                      <div>
                        <span className="text-sm">Channels: </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {mapping.channels.map((channel, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800">{channel}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mapped Date */}
                    {mapping.mappedAt && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Mapped: {new Date(mapping.mappedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { setEditingMapping(mapping); setMappingDrawerOpen(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteMapping(mapping.id || mapping.channelId, selectedProject.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MappingDrawer
        open={mappingDrawerOpen}
        onClose={() => setMappingDrawerOpen(false)}
        onSave={handleSaveMapping}
        editData={editingMapping}
        projectId={selectedProject.id}
      />
    </div>
  );
}