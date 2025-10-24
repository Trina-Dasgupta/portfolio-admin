import { useState } from "react";
import { X, Plus, Code2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const LanguageInput = ({ languages = [], onAdd, onRemove }) => {
  const [name, setName] = useState("");
  const [percent, setPercent] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Language name is required");
      return;
    }

    const percentNum = parseFloat(percent);
    if (isNaN(percentNum) || percentNum < 0 || percentNum > 100) {
      setError("Percentage must be between 0 and 100");
      return;
    }

    // Check if total + new value exceeds 100
    const wouldBeTotal =
      languages.reduce((sum, lang) => sum + lang.percent, 0) + percentNum;
    if (wouldBeTotal > 100) {
      setError(
        `Total percentage cannot exceed 100%. Current: ${wouldBeTotal.toFixed(
          1
        )}%`
      );
      return;
    }

    // Check for duplicate language names
    if (
      languages.some(
        (lang) => lang.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      setError("This language already exists");
      return;
    }

    onAdd({ name: name.trim(), percent: percentNum, color });
    setName("");
    setPercent("");
    setColor("#3b82f6");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const totalPercent = languages.reduce((sum, lang) => sum + lang.percent, 0);
  const isOverLimit = totalPercent > 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-muted-foreground" />
        <Label className="text-sm font-semibold text-foreground sm:text-base">
          Languages Used
        </Label>
      </div>

      <div className="space-y-3">
        {/* Desktop Layout */}
        <div className="hidden sm:flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Language name"
              className="text-sm text-foreground sm:text-base"
            />
          </div>
          <div className="w-24">
            <Input
              type="number"
              value={percent}
              onChange={(e) => {
                setPercent(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="%"
              min="0"
              max="100"
              step="0.1"
              className="text-sm text-foreground sm:text-base"
            />
          </div>
          <div className="relative">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 cursor-pointer p-1"
            />
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            size="default"
            className="px-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder="Language name"
            className="text-sm text-foreground sm:text-base"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              value={percent}
              onChange={(e) => {
                setPercent(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Percentage"
              min="0"
              max="100"
              step="0.1"
              className="flex-1 text-sm text-foreground sm:text-base"
            />
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 cursor-pointer p-1"
            />
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            size="default"
            className="w-full h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {totalPercent > 0 && (
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Total:</span>
            <Badge
              variant={isOverLimit ? "destructive" : "secondary"}
              className="font-mono"
            >
              {totalPercent.toFixed(1)}%
            </Badge>
          </div>
        )}
      </div>

      {languages.length > 0 && (
        <div className="space-y-2">
          {languages.map((lang, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
            >
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 rounded flex-shrink-0 border border-border"
                style={{ backgroundColor: lang.color }}
                title={lang.color}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-sm truncate">
                    {lang.name}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs w-fit">
                    {lang.percent}%
                  </Badge>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                className="h-8 w-8 opacity-60 hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {lang.name}</span>
              </Button>
            </div>
          ))}

          {/* Progress Bar Visualization */}
          <div className="mt-4 space-y-2">
            <div className="flex h-3 rounded-full overflow-hidden bg-secondary">
              {languages.map((lang, i) => (
                <div
                  key={i}
                  style={{
                    width: `${lang.percent}%`,
                    backgroundColor: lang.color,
                  }}
                  className="transition-all duration-300"
                  title={`${lang.name}: ${lang.percent}%`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {languages.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No languages added yet.</p>
          <p className="text-xs mt-1">
            Add your first programming language above.
          </p>
        </div>
      )}
    </div>
  );
};
