

import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/inpute";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, X, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import useApiStore from "../stores/apiStore";
import { Drawer } from "../components/ui/drawer"

const mockMappings = [
  {
    id: "m1",
    project: "Project Alpha",
    name: "Project Alpha",
    labels: ["Frontend", "Bug"],
    events: ["Issue Created", "Issue Closed"],
    channels: ["#general"],
  },
  {
    id: "m2",
    project: "Project Beta",
    name: "Project Beta",
    labels: ["Backend"],
    events: ["Issue Labeled"],
    channels: ["#dev-team", "#alerts"],
  },
];

export function LinearWorkFlow() {
  const [mappings, setMappings] = useState(mockMappings);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMapping, setEditMapping] = useState(null);
  const { data, loading, error, fetchData, postData, putData, deleteData } = useApiStore();

  // Fetch mappings when component mounts
  useEffect(() => {
    fetchData("/mappings/projects");
  }, []);
  
  // Update mappings when API data changes
  useEffect(() => {
    if(data) {
      setMappings(data);
    }
  }, [data]);

  // Fetch available projects when drawer opens
  useEffect(() => {
    if (drawerOpen) {
      
      fetchAvailableProjects();
    }
  }, [drawerOpen]);

  // Mock function to fetch available projects
  const fetchAvailableProjects = () => {
    // Replace this with actual API call in production
    const mockProjects = [
      { id: "p1", name: "Project Alpha" },
      { id: "p2", name: "Project Beta" },
      { id: "p3", name: "Project Gamma" }
    ];
    setAvailableProjects(mockProjects);
  };

  const handleSave = (mapping) => {
    // You might want to add API call here to save to backend
    // Example: postData("/mappings", mapping) or putData(`/mappings/${mapping.id}`, mapping)
    
    setMappings((prev) => {
      const exists = prev.find((m) => m.id === mapping.id);
      if (exists) {
        return prev.map((m) => (m.id === mapping.id ? mapping : m));
      }
      
      // For new mappings, you might want to use the ID returned from the API
      // but for now we'll just use the one from the form
      return [...prev, mapping];
    });
    
    // Close drawer after save
    setDrawerOpen(false);
    
    // Show success message
    toast.success(
      `Mapping ${mapping.id ? "updated" : "created"} successfully!`
    );
  };
  
  const handleDelete = (id) => {
    // You might want to add API call here to delete from backend
    // Example: deleteData(`/mappings/${id}`)
    
    setMappings((prev) => prev.filter((m) => m.id !== id));
    
    // Show success message
    toast.success("Mapping deleted successfully!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Linear → Slack Mappings</h1>
        <Button onClick={() => { setEditMapping(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Mapping
        </Button>
      </div>

      {loading && <p>Loading mappings...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && mappings.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No mappings found. Create your first mapping by clicking the "New Mapping" button.
        </p>
      )}

      <div className="grid gap-4">
        {mappings.map((mapping) => (
          <Card key={mapping.id} className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
              <h2 className="font-semibold">{mapping.name}</h2>
              <p className="textslant italic mt-2.5">{mapping.description}</p>

              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditMapping(mapping); setDrawerOpen(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(mapping.id)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge key={1}>{"label"}</Badge>
            </div> 
            <div className="flex gap-2 flex-wrap">
              <Badge key={1}>{"event"}</Badge>
            </div> 
            <div className="flex gap-2 flex-wrap">
              <Badge key={1}>{"channels"}</Badge>
            </div> 
          </Card>
        ))}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        editData={editMapping}
        list={mappings} // Pass available projects for selection
      />
    </div>
  );
}

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
              onClick={() => setSelectedProject(project)}
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
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
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