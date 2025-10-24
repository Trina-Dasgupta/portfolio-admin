"use client";

import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import ReadmeEditor from "@/components/ReadmeEditor";
import { TagInput } from "@/components/TagInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAbout } from "@/hooks/useAbout";
import { Camera, Loader2, Save } from "lucide-react";

export default function AboutPage() {
  const {
    loading,
    saving,
    formData,
    handleChange,
    handleImageUpload,
    handleSubmit,
    hasChanges,
    setFormData,
  } = useAbout();

  const handleAddSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 max-[800px]:p-2">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground max-[800px]:text-xl">
          About Page
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <ProfilePictureUpload
              src={formData.profilePic}
              onUpload={handleImageUpload}
            />

            {/* Form Fields */}
            <FormField
              id="name"
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your name"
            />

            <FormField
              id="role"
              label="Role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />

            <FormField
              id="miniDescription"
              label="Mini Description"
              value={formData.miniDescription}
              onChange={(e) => handleChange("miniDescription", e.target.value)}
              placeholder="Brief tagline or headline"
            />

            <FormTextarea
              id="description"
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Tell your story..."
              rows={6}
            />

            <FormField
              id="currentFocus"
              label="Current Focus"
              value={formData.currentFocus}
              onChange={(e) => handleChange("currentFocus", e.target.value)}
              placeholder="What are you working on?"
            />

            <TagInput
              label="Skills"
              tags={formData.skills}
              onAdd={handleAddSkill}
              onRemove={handleRemoveSkill}
              placeholder="Add a skill..."
            />

            <ReadmeEditor
              content={formData.aboutReadme}
              onChange={(val) => handleChange("aboutReadme", val)}
            />

            {/* Save Section */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                {hasChanges() ? (
                  <span className="text-amber-500 font-medium">
                    Unsaved changes
                  </span>
                ) : (
                  <span className="text-green-500 font-medium">
                    All changes saved
                  </span>
                )}
              </p>
              <Button onClick={handleSubmit} disabled={!hasChanges() || saving}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-components for better readability
function ProfilePictureUpload({ src, onUpload }) {
  return (
    <div className="flex flex-col items-center gap-3 pb-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={src || ""} />
          <AvatarFallback>IMG</AvatarFallback>
        </Avatar>

        <Label
          htmlFor="profilePicUpload"
          className="absolute bottom-0 right-0 bg-muted p-2 rounded-full cursor-pointer hover:bg-muted/80 transition-colors"
        >
          <Camera className="w-4 h-4" />
        </Label>
        <Input
          id="profilePicUpload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => onUpload(e.target.files[0])}
        />
      </div>
      <p className="text-sm text-muted-foreground">Click icon to upload</p>
    </div>
  );
}
