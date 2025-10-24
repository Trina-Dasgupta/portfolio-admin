import FormField from "@/components/FormField";
import { TagInput } from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";

export const ExperienceCard = ({
  exp,
  index,
  onUpdate,
  onSave,
  hasChanges,
  saving,
}) => {
  const updateField = (field, value) => onUpdate(exp._id, field, value);

  const addTag = (field, value) => {
    onUpdate(exp._id, field, [...exp[field], value]);
  };

  const removeTag = (field, index) => {
    onUpdate(
      exp._id,
      field,
      exp[field].filter((_, i) => i !== index)
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      onUpdate(exp._id, "companyLogo", previewURL);
      onUpdate(exp._id, "selectedFile", file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {/* Company Logo */}
          <div className="grid gap-2">
            <Label className="text-sm font-semibold text-foreground sm:text-base">
              Company Logo
            </Label>
            <div className="relative w-24 h-24 border rounded">
              <Image
                src={exp.companyLogo}
                alt="Company Logo"
                fill
                className="object-contain p-1"
                unoptimized={exp.companyLogo.startsWith("blob:")}
              />
            </div>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <FormField
              id="title"
              label="Title"
              value={exp.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter role title"
            />
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <FormField
              id="location"
              label="Location"
              value={exp.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Eg. Remote"
            />
          </div>

          {/* Timeline */}
          <div className="grid gap-2">
            <FormField
              id="timeline"
              label="Timeline"
              value={exp.timeLine}
              onChange={(e) => updateField("timeLine", e.target.value)}
              placeholder="Eg. May 2025 - Jun 2025"
            />
          </div>

          {/* Current Role */}
          <div className="flex items-center space-x-4 mt-2">
            <Switch
              checked={exp.isCurrent}
              onCheckedChange={(checked) => updateField("isCurrent", checked)}
            />
            <Label className="text-sm font-semibold text-foreground sm:text-base">
              Current Role
            </Label>
          </div>

          {/* Key Achievements */}
          <TagInput
            label="Key Achievements"
            tags={exp.keyAchievements}
            onAdd={(value) => addTag("keyAchievements", value)}
            onRemove={(i) => removeTag("keyAchievements", i)}
            placeholder="Add achievement"
          />

          {/* Technologies Used */}
          <TagInput
            label="Technologies Used"
            tags={exp.technologiesUsed}
            onAdd={(value) => addTag("technologiesUsed", value)}
            onRemove={(i) => removeTag("technologiesUsed", i)}
            placeholder="Add technology"
          />

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              {hasChanges ? (
                <span className="text-amber-500 font-medium">
                  Unsaved changes
                </span>
              ) : (
                <span className="text-green-500 font-medium">
                  All changes saved
                </span>
              )}
            </p>
            <Button
              onClick={() => onSave(exp._id)}
              disabled={!hasChanges || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
