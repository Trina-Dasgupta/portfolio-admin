"use client";

import FormField from "@/components/FormField";
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
import { useS3Upload } from "@/hooks/useS3Upload";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const INITIAL_FORM = {
  companyLogo: "/placeholder.png",
  title: "",
  timeLine: "",
  descriptionTitle: "",
  descriptionPoints: [],
  images: [],
};

export function CreateAchievementDialog({ setMainFormData, setOriginalData }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("/placeholder.png");
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setSelectedLogoFile(file);
    }
  };

  const handleImageChange = (e, imgIndex) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreviews = [...imagePreviews];
      newPreviews[imgIndex] = URL.createObjectURL(file);

      const newFiles = [...selectedImageFiles];
      newFiles[imgIndex] = file;

      setImagePreviews(newPreviews);
      setSelectedImageFiles(newFiles);
    }
  };

  const addImage = () => {
    if (imagePreviews.length >= 2) {
      toast.error("Maximum 2 images allowed");
      return;
    }
    setImagePreviews([...imagePreviews, ""]);
    setSelectedImageFiles([...selectedImageFiles, null]);
  };

  const removeImage = (imgIndex) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== imgIndex));
    setSelectedImageFiles(selectedImageFiles.filter((_, i) => i !== imgIndex));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setLogoPreview("/placeholder.png");
    setSelectedLogoFile(null);
    setImagePreviews([]);
    setSelectedImageFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!selectedLogoFile) {
        toast.error("Please select a company logo");
        setLoading(false);
        return;
      }

      if (formData.descriptionPoints.length === 0) {
        toast.error("Please add at least one description point");
        setLoading(false);
        return;
      }

      if (selectedImageFiles.filter(Boolean).length === 0) {
        toast.error("Please add at least one achievement image");
        setLoading(false);
        return;
      }

      // Upload logo
      const companyLogoUrl = await upload(selectedLogoFile);

      // Upload images
      const uploadedImages = [];
      for (const file of selectedImageFiles) {
        if (file) {
          const imageUrl = await upload(file);
          uploadedImages.push(imageUrl);
        }
      }

      if (uploadedImages.length > 2) {
        toast.error("Maximum 2 images allowed");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/achievement`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            companyLogo: companyLogoUrl,
            title: formData.title,
            timeLine: formData.timeLine,
            descriptionTitle: formData.descriptionTitle,
            descriptionPoints: formData.descriptionPoints,
            images: uploadedImages,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Achievement added successfully!");
        const newEntry = { _id: data.data._id, ...data.data };
        setMainFormData((prev) => [...prev, newEntry]);
        setOriginalData((prev) => [...prev, newEntry]);
        resetForm();
        document.getElementById("close-achievement-dialog")?.click();
      } else {
        toast.error(data.message || "Failed to add achievement");
      }
    } catch (error) {
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Achievement
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Achievement</DialogTitle>
            <DialogDescription>
              Fill in the details and click Save to add a new achievement.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Company Logo */}
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-foreground sm:text-base">
                Company Logo *
              </Label>
              <div className="relative w-24 h-24 border rounded">
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  fill
                  className="object-contain p-1"
                  unoptimized={logoPreview.startsWith("blob:")}
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                required
              />
            </div>

            {/* Title */}
            <div className="grid gap-2">
              <FormField
                id="title"
                label="Title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., Winner of Hackathon 2024"
              />
            </div>

            {/* Timeline */}
            <div className="grid gap-2">
              <FormField
                id="timeline"
                label="Timeline"
                value={formData.timeLine}
                onChange={(e) => updateField("timeLine", e.target.value)}
                placeholder="e.g., March 2024"
              />
            </div>

            {/* Description Title */}
            <div className="grid gap-2">
              <FormField
                id="descriptionTitle"
                label="Description Title"
                value={formData.descriptionTitle}
                onChange={(e) =>
                  updateField("descriptionTitle", e.target.value)
                }
                placeholder="e.g., Project Overview"
              />
            </div>

            {/* Description Points */}
            <TagInput
              label="Description Points"
              tags={formData.descriptionPoints}
              onAdd={(value) => addTag("descriptionPoints", value)}
              onRemove={(i) => removeTag("descriptionPoints", i)}
              placeholder="Add description point"
            />

            {/* Images (Max 2) */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground sm:text-base">
                  Achievement Images (Max 2) *
                </Label>
                {imagePreviews.length < 2 && (
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

              {imagePreviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Click "Add Image" to add up to 2 images.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {imagePreviews.map((preview, imgIndex) => (
                    <div key={imgIndex} className="relative group">
                      <div className="relative w-full h-48 sm:h-40 border-2 border-dashed rounded-lg overflow-hidden bg-muted/30">
                        {preview ? (
                          <Image
                            src={preview}
                            alt={`Preview ${imgIndex + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={preview.startsWith("blob:")}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <span className="text-sm">No image selected</span>
                          </div>
                        )}

                        {/* Overlay with actions - visible on mobile, hover on desktop */}
                        <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageChange(e, imgIndex)}
                              required={!preview}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="pointer-events-none text-xs sm:text-sm"
                            >
                              {preview ? "Change" : "Upload"}
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

            {uploading && (
              <div className="text-sm text-blue-600">Uploading files...</div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                id="close-achievement-dialog"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Achievement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
