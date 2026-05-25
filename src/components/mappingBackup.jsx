import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, X, Edit, Trash, Settings, Search, Filter } from "lucide-react";
import { toast } from "sonner@2.0.3";
import useApiStore from "../stores/apiStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

// Available platforms
const PLATFORMS = [
  { value: "linear", label: "Linear" },
  { value: "github", label: "GitHub" },
  { value: "jira", label: "Jira" },
  { value: "gitlab", label: "GitLab" },
];

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

// Mapping Form Drawer
function MappingDrawer({ open, onClose, onSave, editData }) {
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
  const [availableEvents, setAvailableEvents] = useState(["create", "update", "remove"]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  const { fetchData, postData, putData } = useApiStore();

  // Fetch projects based on platform
  const fetchProjects = async (selectedPlatform) => {
    if (!selectedPlatform) return;
    
    try {
      setLoadingProjects(true);
      const result = await fetchData("/projects");
      console.log("Fetched projects:", result);
      
      let projectsList = [];
      if (Array.isArray(result)) {
        projectsList = result;
      } else if (result?.data && Array.isArray(result.data)) {
        projectsList = result.data;
      } else if (result?.projects && Array.isArray(result.projects)) {
        projectsList = result.projects;
      }
      
      setProjects(projectsList);
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
      console.log("Fetched channels:", result);
      
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
  };

  // Fetch labels for selected project
  const fetchLabels = async (selectedProjectId) => {
    if (!selectedProjectId) return;
    
    try {
      const result = await fetchData(`/projects/${selectedProjectId}/labels`);
      console.log("Fetched labels:", result);
      
      // Transform labels objects to just names for PillsSelector
      const labelNames = result?.data?.data?.map(ch => ch.name) || [];
      setAvailableLabels(labelNames);
    } catch (error) {
      console.error("Error fetching labels:", error);
      toast.error("Failed to fetch labels");
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (open) {
      fetchSlackChannels();
      if (platform) {
        fetchProjects(platform);
      }
      if (projectId) {
        fetchLabels(projectId);
      }
    }
  }, [open]);

  // Fetch projects when platform changes
  useEffect(() => {
    if (platform) {
      fetchProjects(platform);
      // Reset project selection when platform changes
      if (!editData) {
        setProjectId("");
        setLabels([]);
      }
    }
  }, [platform]);

  // Fetch labels when project changes
  useEffect(() => {
    if (projectId) {
      fetchLabels(projectId);
    } else {
      setAvailableLabels([]);
    }
  }, [projectId]);

  // Set form data when editing
  useEffect(() => {
    if (editData) {
      setPlatform(editData.platform || "");
      setProjectId(editData.projectId || "");
      setName(editData.name || "");
      setDescription(editData.description || "");
      
      // Handle labels
      if (typeof editData.labels === 'string') {
        setLabels(editData.labels ? editData.labels.split(',').map(l => l.trim()) : []);
      } else {
        setLabels(editData.labels || []);
      }
      
      // Handle events
      if (typeof editData.events === 'string') {
        setEvents(editData.events ? editData.events.split(',').map(e => e.trim()) : []);
      } else {
        setEvents(editData.events || []);
      }
      
      // Handle channels
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
    // Validation
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
      platform,
      projectId,
      channelIds,
      name: name.trim(),
      description: description.trim(),
      labels,
      events
    };

    console.log("Sending mapping data to backend:", mappingData);

    try {
      const loadingToast = toast.loading(`${editData ? 'Updating' : 'Creating'} mapping...`);
      
      let result;
      if (editData?.id) {
        result = await putData(`/mappings/${editData.id}`, mappingData);
        toast.dismiss(loadingToast);
        toast.success("Mapping updated successfully!");
      } else {
        result = await postData('/mappings', mappingData);
        toast.dismiss(loadingToast);
        toast.success("Mapping created successfully!");
      }
      
      console.log("Backend response:", result);
      
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
            {/* Platform Selection */}
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

            {/* Project Selection */}
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
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mapping Name */}
            <div>
              <label className="text-sm block mb-2">Mapping Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter mapping name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm block mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter mapping description"
                rows={3}
              />
            </div>

            {/* Labels */}
            <div>
              <label className="text-sm block mb-2">Labels</label>
              <PillsSelector 
                options={availableLabels} 
                selected={labels} 
                setSelected={setLabels}
                placeholder={projectId ? "Select labels" : "Select project first"}
              />
            </div>

            {/* Events */}
            <div>
              <label className="text-sm block mb-2">Events *</label>
              <PillsSelector 
                options={availableEvents} 
                selected={events} 
                setSelected={setEvents}
                placeholder="Select events to trigger this mapping"
              />
            </div>

            {/* Slack Channels */}
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

// Main Mappings Component
export function Mappings() {
  const [mappings, setMappings] = useState([]);
  const [mappingDrawerOpen, setMappingDrawerOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    mappingId: null,
    mappingName: null
  });
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState("all");
  
  const { fetchData, deleteData } = useApiStore();

  // Fetch all mappings
  const fetchMappings = async () => {
    try {
      setLoading(true);
      const result = await fetchData("/mappings");
      console.log("Fetched mappings:", result);
      
      let fetchedMappings = [];
      
      if (Array.isArray(result)) {
        fetchedMappings = result;
      } else if (result?.data && Array.isArray(result.data)) {
        fetchedMappings = result.data;
      } else if (result?.mappings && Array.isArray(result.mappings)) {
        fetchedMappings = result.mappings;
      }
      
      setMappings(fetchedMappings);
      
      if (fetchedMappings.length > 0) {
        toast.success(`${fetchedMappings.length} mapping(s) loaded`);
      }
    } catch (error) {
      console.error("Error fetching mappings:", error);
      toast.error("Failed to fetch mappings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  const handleSaveMapping = async (mapping) => {
    // Refresh mappings list
    await fetchMappings();
    setMappingDrawerOpen(false);
    setEditingMapping(null);
  };

  const handleEditMapping = (mapping) => {
    setEditingMapping(mapping);
    setMappingDrawerOpen(true);
  };

  const confirmDeleteMapping = (id, name) => {
    setDeleteConfirmation({
      open: true,
      mappingId: id,
      mappingName: name
    });
  };

  const handleDeleteMapping = async () => {
    const { mappingId, mappingName } = deleteConfirmation;
    
    try {
      const loadingToast = toast.loading('Deleting mapping...');
      
      await deleteData(`/mappings/${mappingId}`);
      
      // Refresh list
      await fetchMappings();
      
      toast.dismiss(loadingToast);
      toast.success(`Mapping "${mappingName}" deleted successfully!`);
      
      setDeleteConfirmation({ open: false, mappingId: null, mappingName: null });
    } catch (error) {
      console.error('Error deleting mapping:', error);
      toast.error("Failed to delete mapping. " + (error?.message || "Please try again."));
    }
  };

  const getPlatformBadgeColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'linear': return 'bg-purple-100 text-purple-800';
      case 'github': return 'bg-gray-100 text-gray-800';
      case 'jira': return 'bg-blue-100 text-blue-800';
      case 'gitlab': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique projects for filter dropdown
  const uniqueProjects = React.useMemo(() => {
    const projectsSet = new Set();
    mappings.forEach(mapping => {
      if (mapping.projectName) {
        projectsSet.add(mapping.projectName);
      } else if (mapping.projectId) {
        projectsSet.add(mapping.projectId);
      }
    });
    return Array.from(projectsSet).sort();
  }, [mappings]);

  // Get unique platforms for filter dropdown
  const uniquePlatforms = React.useMemo(() => {
    const platformsSet = new Set();
    mappings.forEach(mapping => {
      if (mapping.platform) {
        platformsSet.add(mapping.platform);
      }
    });
    return Array.from(platformsSet).sort();
  }, [mappings]);

  // Filter and search mappings
  const filteredMappings = React.useMemo(() => {
    return mappings.filter(mapping => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          mapping.name,
          mapping.description,
          mapping.platform,
          mapping.projectName,
          mapping.projectId,
          ...(mapping.labels || []),
          ...(mapping.events || []),
          ...(mapping.channels || [])
        ].filter(Boolean);
        
        const matchesSearch = searchableFields.some(field => 
          String(field).toLowerCase().includes(query)
        );
        
        if (!matchesSearch) return false;
      }
      
      // Project filter
      if (selectedProjectFilter !== "all") {
        const projectMatch = mapping.projectName === selectedProjectFilter || 
                            mapping.projectId === selectedProjectFilter;
        if (!projectMatch) return false;
      }

      // Platform filter
      if (selectedPlatformFilter !== "all") {
        if (mapping.platform !== selectedPlatformFilter) return false;
      }
      
      return true;
    });
  }, [mappings, searchQuery, selectedProjectFilter, selectedPlatformFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProjectFilter("all");
    setSelectedPlatformFilter("all");
  };

  const hasActiveFilters = searchQuery || selectedProjectFilter !== "all" || selectedPlatformFilter !== "all";

  return (
    <div className="p-6">
      <AlertDialog 
        open={deleteConfirmation.open} 
        onOpenChange={(open) => 
          setDeleteConfirmation({ open, mappingId: null, mappingName: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mapping 
              <strong className="text-foreground"> "{deleteConfirmation.mappingName}"</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive rounded-md p-2 text-sm text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteMapping}
            >
              Delete Mapping
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Mappings</h1>
          <p className="text-muted-foreground">
            Manage platform integrations and Slack channel mappings
          </p>
        </div>
        <Button onClick={() => { setEditingMapping(null); setMappingDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Mapping
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mappings by name, description, labels, channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Platform Filter */}
          <div className="w-full md:w-48">
            <Select value={selectedPlatformFilter} onValueChange={setSelectedPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {uniquePlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Filter */}
          <div className="w-full md:w-48">
            <Select value={selectedProjectFilter} onValueChange={setSelectedProjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map(project => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" /> Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        {hasActiveFilters && (
          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredMappings.length} of {mappings.length} mapping(s)
          </div>
        )}
      </Card>

      {/* Mappings List */}
      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading mappings...</p>
        </Card>
      ) : filteredMappings.length === 0 && !hasActiveFilters ? (
        <Card className="p-8 text-center">
          <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No mappings configured</h3>
          <p className="text-muted-foreground mb-4">
            Create your first mapping to connect platforms with Slack channels
          </p>
          <Button onClick={() => { setEditingMapping(null); setMappingDrawerOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Mapping
          </Button>
        </Card>
      ) : filteredMappings.length === 0 && hasActiveFilters ? (
        <Card className="p-8 text-center">
          <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No mappings found</h3>
          <p className="text-muted-foreground mb-4">
            No mappings match your current filters. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" /> Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMappings.map((mapping, index) => (
            <Card key={mapping.id || index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Platform & Project */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPlatformBadgeColor(mapping.platform)}>
                      {mapping.platform || 'Unknown'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {mapping.projectName || mapping.projectId || 'Unknown Project'}
                    </span>
                  </div>

                  {/* Mapping Name */}
                  <h3 className="mb-1">
                    {mapping.name || 'Unnamed Mapping'}
                  </h3>

                  {/* Description */}
                  {mapping.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {mapping.description}
                    </p>
                  )}

                  {/* Labels */}
                  {mapping.labels && Array.isArray(mapping.labels) && mapping.labels.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground">Labels: </span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {mapping.labels.slice(0, 3).map((label, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                        {mapping.labels.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mapping.labels.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  {mapping.events && Array.isArray(mapping.events) && mapping.events.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground">Events: </span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {mapping.events.map((event, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Channels */}
                  {mapping.channels && Array.isArray(mapping.channels) && mapping.channels.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">Channels: </span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {mapping.channels.slice(0, 2).map((channel, idx) => (
                          <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                            {channel}
                          </Badge>
                        ))}
                        {mapping.channels.length > 2 && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            +{mapping.channels.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 ml-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditMapping(mapping)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => confirmDeleteMapping(mapping.id, mapping.name)}
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
        onClose={() => {
          setMappingDrawerOpen(false);
          setEditingMapping(null);
        }}
        onSave={handleSaveMapping}
        editData={editingMapping}
      />
    </div>
  );
}