import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { 
  Plus, 
  Search, 
  X, 
  Settings, 
  Filter, 
  Edit, 
  Trash, 
  ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';
import useApiStore from "../../stores/apiStore"
import { MappingDrawer } from './mappingDrawer'; 
import { MappingDetailsDrawer } from './mappingDetailsDrawer'; 

const ITEMS_PER_PAGE = 10;

export function Mappings() {
  const [mappings, setMappings] = useState([]);
  const [mappingDrawerOpen, setMappingDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  const { fetchData, deleteData } = useApiStore();

  // fetch all mappings from the API
  const fetchMappings = async () => {
    try {
      setLoading(true);
      const result = await fetchData("/mappings");
      setMappings(result?.data?.mappings || []);

      if (result?.data?.mappings?.length > 0) {
        toast.success(`${result.data.mappings.length} mapping(s) loaded`);
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
    await fetchMappings();
    setMappingDrawerOpen(false);
    setEditingMapping(null);
  };

  const handleEditMapping = (mapping) => {
    setEditingMapping(mapping);
    setMappingDrawerOpen(true);
  };

  const handleRowClick = (mapping) => {
    setSelectedMapping(mapping);
    setDetailsDrawerOpen(true);
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
      
      await deleteData(`/mappings/id/${mappingId}`);
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

  // Get unique projects and platforms for filters
  const uniqueProjects = useMemo(() => {
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

  const uniquePlatforms = useMemo(() => {
    const platformsSet = new Set();
    mappings.forEach(mapping => {
      if (mapping.platform) {
        platformsSet.add(mapping.platform);
      }
    });
    return Array.from(platformsSet).sort();
  }, [mappings]);

  // Filter and search mappings
  const filteredMappings = useMemo(() => {
    return mappings.filter(mapping => {
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
      
      if (selectedProjectFilter !== "all") {
        const projectMatch = mapping.projectName === selectedProjectFilter || 
                            mapping.projectId === selectedProjectFilter;
        if (!projectMatch) return false;
      }

      if (selectedPlatformFilter !== "all") {
        if (mapping.platform !== selectedPlatformFilter) return false;
      }
      
      return true;
    });
  }, [mappings, searchQuery, selectedProjectFilter, selectedPlatformFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMappings = filteredMappings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedProjectFilter, selectedPlatformFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProjectFilter("all");
    setSelectedPlatformFilter("all");
  };

  const hasActiveFilters = searchQuery || selectedProjectFilter !== "all" || selectedPlatformFilter !== "all";

  // Helper function to generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-6">
      {/* delete confirmation dialog */}
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
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mappings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" /> Clear
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredMappings.length} of {mappings.length} mapping(s)
          </div>
        )}
      </Card>

      {/* Mappings Table */}
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
            No mappings match your current filters.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" /> Clear Filters
          </Button>
        </Card>
      ) : (
        <>
          <Card>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50">
              <div className="col-span-2 text-sm">Platform</div>
              <div className="col-span-3 text-sm">Project</div>
              <div className="col-span-3 text-sm">Mapping Name</div>
              <div className="col-span-2 text-sm">Channels</div>
              <div className="col-span-2 text-sm text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {paginatedMappings.map((mapping, index) => (
                <div
                  key={mapping.id || index}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(mapping)}
                >
                  <div className="col-span-2 flex items-center">
                    <Badge className={getPlatformBadgeColor(mapping.platform)}>
                      {mapping.platform || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="col-span-3 flex items-center text-sm">
                    {mapping.projectName || mapping.projectId || 'Unknown Project'}
                  </div>

                  <div className="col-span-3 flex items-center">
                    {mapping.name || 'Unnamed Mapping'}
                  </div>

                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {mapping.channels?.length || 1} channel{mapping.channels?.length !== 1 ? 's' : ''}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditMapping(mapping);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteMapping(mapping.id, mapping.name);
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredMappings.length)} of {filteredMappings.length} mappings
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page, idx) => (
                    <PaginationItem key={idx}>
                      {page === '...' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Details Drawer */}
      <MappingDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedMapping(null);
        }}
        mapping={selectedMapping}
        onEdit={handleEditMapping}
        onDelete={confirmDeleteMapping}
      />

      {/* Form Drawer */}
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