
import React, { useState, useEffect } from "react";
import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Input } from "./inpute";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Plus, X, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

export function PillsSelector({ options, selected, setSelected }) {
  const toggleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((o) => o !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Badge
          key={opt.id}
          onClick={() => toggleSelect(opt.name)}
          className={`cursor-pointer px-3 py-1 rounded-full ${
            selected.includes(opt.name) ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          {opt.name}
        </Badge>
      ))}
    </div>
  );
}