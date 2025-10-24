import FormField from "@/components/FormField";
import { TagInput } from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X } from "lucide-react";
import Image from "next/image";

export const AchievementCard = ({
  achievement,
  index,
  onUpdate,
  onSave,
  hasChanges,
  saving,
}) => {
  const updateField = (field, value) => onUpdate(achievement._id, field, value);

  const addTag = (field, value) => {
    onUpdate(achievement._id, field, [...achievement[field], value]);
  };

  const removeTag = (field, index) => {
    onUpdate(
      achievement._id,
      field,
      achievement[field].filter((_, i) => i !== index)
    );
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      onUpdate(achievement._id, "companyLogo", previewURL);
      onUpdate(achievement._id, "selectedLogoFile", file);
    }
  };

  const handleImageChange = (e, imgIndex) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      const newImages = [...achievement.images];
      newImages[imgIndex] = previewURL;

      const newFiles = achievement.selectedImageFiles || [];
      newFiles[imgIndex] = file;

      onUpdate(achievement._id, "images", newImages);
      onUpdate(achievement._id, "selectedImageFiles", newFiles);
    }
  };

  const addImage = () => {
    if (achievement.images.length >= 2) {
      return;
    }
    onUpdate(achievement._id, "images", [...achievement.images, ""]);
  };

  const removeImage = (imgIndex) => {
    const newImages = achievement.images.filter((_, i) => i !== imgIndex);
    const newFiles = (achievement.selectedImageFiles || []).filter(
      (_, i) => i !== imgIndex
    );
    onUpdate(achievement._id, "images", newImages);
    onUpdate(achievement._id, "selectedImageFiles", newFiles);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Achievement {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {/* Company Logo */}
          <div className="grid gap-2">
            <Label className="text-sm font-semibold text-foreground sm:text-base">Company Logo</Label>
            <div className="relative w-24 h-24 border rounded">
              <Image
                src={achievement?.companyLogo}
                alt="Company Logo"
                fill
                className="object-contain p-1"
                unoptimized={achievement.companyLogo.startsWith("blob:")}
              />
            </div>
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <FormField
              id="title"
              label="Title"
              value={achievement.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g., Winner of Hackathon 2024"
            />
          </div>

          {/* Timeline */}
          <div className="grid gap-2">
            <FormField
              id="timeline"
              label="Timeline"
              value={achievement.timeLine}
              onChange={(e) => updateField("timeLine", e.target.value)}
              placeholder="e.g., March 2024"
            />
          </div>

          {/* Description Title */}
          <div className="grid gap-2">
            <FormField
              id="descriptionTitle"
              label="Description Title"
              value={achievement.descriptionTitle}
              onChange={(e) => updateField("descriptionTitle", e.target.value)}
              placeholder="e.g., Project Overview"
            />
          </div>

          {/* Description Points */}
          <TagInput
            label="Description Points"
            tags={achievement.descriptionPoints}
            onAdd={(value) => addTag("descriptionPoints", value)}
            onRemove={(i) => removeTag("descriptionPoints", i)}
            placeholder="Add description point"
          />

          {/* Images (Max 2) */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground sm:text-base">Achievement Images (Max 2)</Label>
              {achievement.images.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImage}
                >
                  Add Image
                </Button>
              )}
            </div>

            {achievement.images.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No images added yet. Click "Add Image" to add up to 2 images.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievement.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative group">
                    <div className="relative w-full h-48 sm:h-40 border-2 border-dashed rounded-lg overflow-hidden bg-muted/30">
                      {img && (
                        <Image
                          src={img}
                          alt={`Achievement Image ${imgIndex + 1}`}
                          fill
                          className="object-cover"
                          unoptimized={img.startsWith("blob:")}
                        />
                      )}

                      {/* Overlay with actions - visible on mobile, hover on desktop */}
                      <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, imgIndex)}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="pointer-events-none text-xs sm:text-sm"
                          >
                            Change
                          </Button>
                        </label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(imgIndex)}
                          className="text-xs sm:text-sm"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>

                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                        Image {imgIndex + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              onClick={() => onSave(achievement._id)}
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
