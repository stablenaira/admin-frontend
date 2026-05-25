import { Badge } from "../ui/badge";
import {  X } from "lucide-react";


// Available platforms
const PLATFORMS = [
  { value: "linear", label: "Linear" },
  { value: "github", label: "GitHub" },
  { value: "jira", label: "Jira" },
  { value: "gitlab", label: "GitLab" },
];

// Pills Selector Component
export function PillsSelector({ options, selected, setSelected, placeholder }) {
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
