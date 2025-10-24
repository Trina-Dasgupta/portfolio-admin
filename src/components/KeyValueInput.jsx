import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export const KeyValueInput = ({
  label,
  items = [],
  onAdd,
  onRemove,
  keyPlaceholder = "Enter key",
  valuePlaceholder = "Enter value",
}) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!key.trim() || !value.trim()) {
      setError("Both key and value are required");
      return;
    }

    // Check for duplicate keys
    if (
      items.some(
        (item) => item.title.toLowerCase() === key.trim().toLowerCase()
      )
    ) {
      setError("This key already exists");
      return;
    }

    onAdd({ title: key.trim(), value: value.trim() });
    setKey("");
    setValue("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-sm font-semibold text-foreground sm:text-base">
          {label}
        </Label>
      )}

      <div className="space-y-3">
        <div className="flex gap-2 max-[800px]:flex-col">
          <div className="flex-1">
            <Input
              type="text"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder={keyPlaceholder}
              className="text-sm text-foreground sm:text-base"
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder={valuePlaceholder}
              className="text-sm text-foreground sm:text-base"
            />
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            size="default"
            className="h-10 px-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {item.title}
                  </Badge>
                  <span className="text-sm text-muted-foreground truncate">
                    {item.value}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                className="h-8 w-8 opacity-60 hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {item.title}</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          No items added yet. Add your first key-value pair above.
        </div>
      )}
    </div>
  );
};
