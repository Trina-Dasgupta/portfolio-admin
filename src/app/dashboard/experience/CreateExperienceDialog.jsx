"use client";

import { TagInput } from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useS3Upload } from "@/hooks/useS3Upload";
import { useExperience } from "@/hooks/useExperience";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FormField from "@/components/FormField";

export function CreateExperienceDialog() {
  const { createExperience, INITIAL_FORM } = useExperience();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("/placeholder.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const { upload, uploading } = useS3Upload();

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addTag = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], value] }));
  };

  const removeTag = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setLogoPreview("/placeholder.png");
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createExperience(
      { ...formData, selectedFile },
      upload
    );

    if (result) {
      resetForm();
      document.getElementById("close-experience-dialog")?.click();
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus /> Add Experience
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new Experience</DialogTitle>
            <DialogDescription>
              Fill the details and click Save to add a new experience.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-foreground sm:text-base">
                Company Logo
              </Label>
              <Image
                src={logoPreview || "/placeholder.svg"}
                alt="Logo Preview"
                width={100}
                height={100}
                className="object-contain p-1"
                unoptimized={logoPreview.startsWith("blob:")}
              />
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {uploading && (
                <div className="text-sm mt-1">Uploading image...</div>
              )}
            </div>

            <div className="grid gap-2">
              <FormField
                id="title"
                label="Title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter role title"
              />
            </div>

            <div className="grid gap-2">
              <FormField
                id="location"
                label="Location"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Eg. Remote"
              />
            </div>

            <div className="grid gap-2">
              <FormField
                id="timeline"
                label="Timeline"
                value={formData.timeLine}
                onChange={(e) => updateField("timeLine", e.target.value)}
                placeholder="Eg. May 2025 - Jun 2025"
              />
            </div>

            <div className="flex items-center space-x-4 mt-2">
              <Switch
                checked={formData.isCurrent}
                onCheckedChange={(checked) => updateField("isCurrent", checked)}
              />
              <Label className="text-sm font-semibold text-foreground sm:text-base">
                Current Role
              </Label>
            </div>

            <TagInput
              label="Key Achievements"
              tags={formData.keyAchievements}
              onAdd={(value) => addTag("keyAchievements", value)}
              onRemove={(i) => removeTag("keyAchievements", i)}
              placeholder="Add achievement"
            />

            <TagInput
              label="Technologies Used"
              tags={formData.technologiesUsed}
              onAdd={(value) => addTag("technologiesUsed", value)}
              onRemove={(i) => removeTag("technologiesUsed", i)}
              placeholder="Add technology"
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" id="close-experience-dialog">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Experience"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
