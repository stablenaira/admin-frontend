import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X, Edit, Trash } from "lucide-react";

// Mapping Details Drawer - Read-only view
export function MappingDetailsDrawer({ open, onClose, mapping, onEdit, onDelete }) {
  if (!open || !mapping) return null;

  const getPlatformBadgeColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'linear': return 'bg-purple-100 text-purple-800';
      case 'github': return 'bg-gray-100 text-gray-800';
      case 'jira': return 'bg-blue-100 text-blue-800';
      case 'gitlab': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Mapping Details</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Platform */}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Platform</label>
              <Badge className={getPlatformBadgeColor(mapping.platform)}>
                {mapping.platform || 'Unknown'}
              </Badge>
            </div>

            {/* Project */}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Project</label>
              <p>{mapping.projectName || mapping.projectId || 'Unknown Project'}</p>
            </div>

            {/* Mapping Name */}
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Mapping Name</label>
              <p>{mapping.name || 'Unnamed Mapping'}</p>
            </div>

            {/* Description */}
            {mapping.description && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Description</label>
                <p className="text-sm">{mapping.description}</p>
              </div>
            )}
            {/* Channel Name */}
            {mapping.channelName && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Channel Name</label>
                <p className="text-sm">{mapping.channelName}</p>
              </div>
            )}

            {/* Labels */}
            {mapping.labels && Array.isArray(mapping.labels) && mapping.labels.length > 0 && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Labels</label>
                <div className="flex gap-2 flex-wrap">
                  {mapping.labels.map((label, idx) => (
                    <Badge key={idx} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {mapping.events && Array.isArray(mapping.events) && mapping.events.length > 0 && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Events</label>
                <div className="flex gap-2 flex-wrap">
                  {mapping.events.map((event, idx) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Slack Channels */}
            {mapping.channels && Array.isArray(mapping.channels) && mapping.channels.length > 0 && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Slack Channels</label>
                <div className="flex gap-2 flex-wrap">
                  {mapping.channels.map((channel, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Mapped Date */}
            {mapping.mappedAt && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Created</label>
                <p className="text-sm">
                  {new Date(mapping.mappedAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                className="flex-1" 
                onClick={() => {
                  onEdit(mapping);
                  onClose();
                }}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Mapping
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  onDelete(mapping.id, mapping.name);
                  onClose();
                }}
              >
                <Trash className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}