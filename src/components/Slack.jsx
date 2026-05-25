import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "./ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, X, Edit, Trash, ArrowLeft, Settings, FolderOpen, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import useApiStore from "../stores/apiStore";


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
      await putData(`/mappings/channels/${editData?.id}?name=${projectPayload.name}&description=${projectPayload.description}`);
      fetchData("/mappings/channels")
      toast.success("Project updated successfully!");
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
  const [channels, setChannels] = useState(editData?.channels || []);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      setLabels(editData.labels || []);
      setEvents(editData.events || []);
      setChannels(editData.channels || []);
    } else {
      setName("");
      setDescription("");
      setLabels([]);
      setEvents([]);
      setChannels([]);
    }
  }, [editData, open]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Mapping name is required");
      return;
    }

    onSave({
      id: editData?.id || `m${Date.now()}`,
      projectId,
      name: name.trim(),
      description: description.trim(),
      labels,
      events,
      channels
    });
    onClose();
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
              <label className="text-sm font-medium block mb-2">Events</label>
              <PillsSelector 
                options={availableEvents} 
                selected={events} 
                setSelected={setEvents}
                placeholder="Select events to trigger this mapping"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Slack Channels</label>
              <PillsSelector 
                options={availableChannels} 
                selected={channels} 
                setSelected={setChannels}
                placeholder="Select Slack channels for notifications"
              />
            </div>

            <Button className="w-full" onClick={handleSave}>
              {editData ? "Update Mapping" : "Create Mapping"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function SlackWorkFlow() {
  const [projects, setProjects] = useState([]);
  const [mappings, setMappings] = useState(mockMappings);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [mappingDrawerOpen, setMappingDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingMapping, setEditingMapping] = useState(null);
  const { data, loading, error, fetchData, postData, putData, deleteData } = useApiStore();

  // Project CRUD operations
  // No longer needed, ProjectDrawer handles update directly
  const handleSaveProject = () => {};

    useEffect(() => {
      fetchData("/mappings/channels");
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
          toast.success("Channels fetched successfully!");
        }
        // onClose();
      }
  
  // Handle error state
  if (error) {
    toast.error("Failed to fetch projects");
  }
}, [data, loading, error]);

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    
    // Remove mappings for this project
    setMappings((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    
    // If we're viewing this project, go back to projects list
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    
    toast.success(`Project deleted successfully! ${id}`);
  };

  // Mapping CRUD operations
  const handleSaveMapping = (mapping) => {
    setMappings((prev) => {
      const projectMappings = prev[mapping.projectId] || [];
      const exists = projectMappings.find((m) => m.id === mapping.id);
      
      if (exists) {
        return {
          ...prev,
          [mapping.projectId]: projectMappings.map((m) => 
            m.id === mapping.id ? mapping : m
          )
        };
      }
      
      return {
        ...prev,
        [mapping.projectId]: [...projectMappings, mapping]
      };
    });
    
    toast.success(`Mapping ${mapping.id ? "updated" : "created"} successfully!`);
  };

  const handleDeleteMapping = (mappingId, projectId) => {
    setMappings((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter((m) => m.id !== mappingId)
    }));
    
    toast.success("Mapping deleted successfully!");
  };

  const handleSync = () => {
    setTimeout(()=>{

    }, 3000)
    
    console.log("refreshed")
  }

  const currentProjectMappings = selectedProject ? (mappings[selectedProject.id] || []) : [];

  // Render projects list
  if (!selectedProject) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Slack Channel</h1>
            <p className="text-muted-foreground">Manage your Slack integrations</p>
          </div>
          <Button onClick={() => { fetchData("/mappings/channels") }}>
            { loading ? "loading" : <>Sync <RefreshCcw /></>}
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              No projects available. Please sync to fetch projects.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {Array.isArray(projects) && projects.map((project) => (
              <Card key={project.id || project.name || Math.random()} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1" onClick={() => setSelectedProject(project)}>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg font-semibold">{project.name}</h2>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{project.description}</p>
                    {/* <p className="text-sm text-muted-foreground">
                      Created: {project.createdAt} • 
                      {(mappings[project.id] || []).length} mapping(s)
                    </p> */}
                  </div>
                  <div className="flex gap-2">
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
                        handleDeleteProject(project.id); 
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
          <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
          <p className="text-muted-foreground">{selectedProject.description}</p>
        </div>
        <Button onClick={() => { setEditingMapping(null); setMappingDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Mapping
        </Button>
      </div>

      {currentProjectMappings.length === 0 ? (
        <Card className="p-8 text-center">
          <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No mappings configured</h3>
          <p className="text-muted-foreground mb-4">
            Create your first mapping to connect Linear issues with Slack channels
          </p>
          <Button onClick={() => { setEditingMapping(null); setMappingDrawerOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Create Mapping
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {currentProjectMappings.map((mapping) => (
            <Card key={mapping.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">{mapping.name}</h2>
                  <p className="text-muted-foreground mb-4">{mapping.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Labels: </span>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {mapping.labels.map((label) => (
                          <Badge key={label} variant="outline">{label}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Events: </span>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {mapping.events.map((event) => (
                          <Badge key={event} className="bg-blue-100 text-blue-800">{event}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Channels: </span>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {mapping.channels.map((channel) => (
                          <Badge key={channel} className="bg-green-100 text-green-800">{channel}</Badge>
                        ))}
                      </div>
                    </div>
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
                    onClick={() => handleDeleteMapping(mapping.id, selectedProject.id)}
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