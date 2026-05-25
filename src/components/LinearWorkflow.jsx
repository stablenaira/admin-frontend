
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

export function Linear() {
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
      setMappings((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      
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
    setTimeout(() => {
      fetchData("/projects");
    }, 3000);
    
    console.log("refreshed");
  };

  // Fetch all mappings for a selected project
  const handleselectedPro = async(project) => {
    setSelectedProject(project);
    setLoadingMappings(true);
    
    try {
      const result = await fetchData(`/mappings/${project.id}`);
      console.log(result, "result");
      
      // Ensure mappings is always an array
      let fetchedMappings = [];
      
      if (Array.isArray(result)) {
        fetchedMappings = result;
      } else if (result?.data) {
        // Try different possible structures
        if (Array.isArray(result.data)) {
          fetchedMappings = result.data;
        } else if (Array.isArray(result.data.mappings)) {
          fetchedMappings = result.data.mappings;
        } else if (result.data.data && Array.isArray(result.data.data)) {
          fetchedMappings = result.data.data;
        }
      }
      
      setMappings(fetchedMappings);
      
      if (fetchedMappings.length > 0) {
        toast.success("Mappings loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching mappings:", error);
      setMappings([]); // Ensure it's an empty array on error
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
            <h1 className="text-2xl font-bold">Linear Projects</h1>
            <p className="text-muted-foreground">Manage your Linear projects and their Slack integrations</p>
          </div>
          <Button onClick={() => { fetchData("/projects"); }}>
            {loading ? "Loading..." : <><RefreshCcw className="w-4 h-4 mr-2" /> Sync</>}
          </Button>
        </div>

        {projects?.data?.length === 0 ? (
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
              <Card 
                key={project.id || project.name || Math.random()} 
                className="p-6 hover:shadow-md transition-shadow"
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 
                        className="text-lg cursor-pointer hover:text-primary transition-colors"
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

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{decimalToPercentage(project.progress)}</span>
                      </div>
                      <Progress value={decimalToPercentage(project.progress, 0, false)} className="h-2" />
                    </div>
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
          <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
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
          {mappings.map((mapping) => (
            <Card key={mapping.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">{mapping.name}</h2>
                  <p className="text-muted-foreground mb-4">{mapping.description}</p>
                  
                  <div className="space-y-3">
                    {mapping.labels && mapping.labels.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Labels: </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {mapping.labels.map((label) => (
                            <Badge key={label} variant="outline">{label}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {mapping.events && mapping.events.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Events: </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {mapping.events.map((event) => (
                            <Badge key={event} className="bg-blue-100 text-blue-800">{event}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {mapping.channels && mapping.channels.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Channels: </span>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {mapping.channels.map((channel) => (
                            <Badge key={channel} className="bg-green-100 text-green-800">{channel}</Badge>
                          ))}
                        </div>
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