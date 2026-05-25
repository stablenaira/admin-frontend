import React, { useState, useEffect } from "react";
import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Input } from "./inpute";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Plus, X, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import {PillsSelector} from './pileSelector'

const mockLabels = [
  { id: "l1", name: "Frontend" },
  { id: "l2", name: "Backend" },
  { id: "l3", name: "Bug" },
];

const mockEvents = [
  { id: "e1", name: "Issue Created" },
  { id: "e2", name: "Issue Closed" },
  { id: "e3", name: "Issue Labeled" },
];

const mockSlackChannels = [
  { id: "c1", name: "#general" },
  { id: "c2", name: "#dev-team" },
  { id: "c3", name: "#alerts" },
];

export function Drawer({ open, onClose, onSave, editData, list }) {
  const [project, setProject] = useState(editData?.project || "");
  const [labels, setLabels] = useState(editData?.labels || []);
  const [events, setEvents] = useState(editData?.events || []);
  const [channels, setChannels] = useState(editData?.channels || []);

  const handleSave = () => {
    onSave({
      id: editData?.id || Date.now().toString(),
      project,
      labels,
      events,
      channels,
    });
    // console.log(onSave())
    toast.success("Mapping successful!", {
        description: "Your request has been posted to #feature-requests and a Linear issue has been created.",
        duration: 5000,
    });
    onClose();
  };

  console.log(labels)

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sliding Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">{editData ? "Edit Mapping" : "New Mapping"}</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Project */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Project</label>
            <Select onValueChange={(val) => setProject(val)} value={project}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {list.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Labels */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Labels</label>
            <PillsSelector options={mockLabels} selected={labels} setSelected={setLabels} />
          </div>

          {/* Events */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Events</label>
            <PillsSelector options={mockEvents} selected={events} setSelected={setEvents} />
          </div>

          {/* Slack Channels */}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">Slack Channels</label>
            <PillsSelector options={mockSlackChannels} selected={channels} setSelected={setChannels} />
          </div>

          <Button className="w-full" onClick={handleSave}>
            Save Mapping
          </Button>
        </div>
      </div>
    </>
  );
}
