"use client";

import { Card } from "@/components/ui/card";
import { useAchievements } from "@/hooks/useAchievements";
import { useS3Upload } from "@/hooks/useS3Upload";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateAchievementDialog } from "./CreateAchievementDialog";
import { AchievementCard } from "./AchievementCard";

export default function AchievementPage() {
  const {
    achievements,
    setAchievements,
    originalData,
    setOriginalData,
    loading,
  } = useAchievements();
  const [saving, setSaving] = useState(false);
  const { upload } = useS3Upload();

  const updateAchievement = (id, field, value) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach._id === id ? { ...ach, [field]: value } : ach))
    );
  };

  const getChangedFields = (id) => {
    const current = achievements.find((ach) => ach._id === id);
    const original = originalData.find((ach) => ach._id === id);
    if (!current || !original) return null;

    const changedFields = {};
    const keys = [
      "companyLogo",
      "title",
      "timeLine",
      "descriptionTitle",
      "descriptionPoints",
      "images",
    ];

    keys.forEach((key) => {
      if (Array.isArray(current[key])) {
        if (current[key].join(",") !== original[key].join(",")) {
          changedFields[key] = current[key];
        }
      } else if (current[key] !== original[key]) {
        changedFields[key] = current[key];
      }
    });

    return Object.keys(changedFields).length > 0 ? changedFields : null;
  };

  const hasChanges = (id) => {
    return getChangedFields(id) !== null;
  };

  const handleSave = async (id) => {
    const changedFields = getChangedFields(id);
    if (!changedFields) return;

    setSaving(true);

    try {
      const achData = achievements.find((ach) => ach._id === id);

      // Upload new logo if it's a blob and logo field has changed
      if (
        changedFields.companyLogo?.startsWith("blob:") &&
        achData.selectedLogoFile
      ) {
        try {
          changedFields.companyLogo = await upload(achData.selectedLogoFile);
        } catch (err) {
          toast.error("Failed to upload logo");
          setSaving(false);
          return;
        }
      }

      // Upload new images if they're blobs
      if (changedFields.images) {
        const uploadedImages = [];
        for (let i = 0; i < changedFields.images.length; i++) {
          const img = changedFields.images[i];
          if (img.startsWith("blob:") && achData.selectedImageFiles?.[i]) {
            try {
              const uploaded = await upload(achData.selectedImageFiles[i]);
              uploadedImages.push(uploaded);
            } catch (err) {
              toast.error(`Failed to upload image ${i + 1}`);
              setSaving(false);
              return;
            }
          } else {
            uploadedImages.push(img);
          }
        }
        changedFields.images = uploadedImages;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/achievement/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changedFields),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Achievement updated successfully!");
        setOriginalData((prev) =>
          prev.map((ach) =>
            ach._id === id ? { ...achievements.find((a) => a._id === id) } : ach
          )
        );
      } else {
        toast.error(data.message || "Failed to update achievement");
      }
    } catch (error) {
      toast.error("Error saving achievement");
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center max-[800px]:flex-col max-[800px]:items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className=" mt-1">Manage your achievements</p>
          </div>
          <CreateAchievementDialog
            setMainFormData={setAchievements}
            setOriginalData={setOriginalData}
          />
        </div>

        <div className="space-y-3">
          {achievements.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  No Achievements yet
                </h3>
                <p className="mb-4">
                  Get started by creating your first achievement
                </p>
                <CreateAchievementDialog
                  setMainFormData={setAchievements}
                  setOriginalData={setOriginalData}
                />
              </div>
            </div>
          ) : (
            achievements.map((ach, idx) => (
              <AchievementCard
                key={ach._id}
                achievement={ach}
                index={idx}
                onUpdate={updateAchievement}
                onSave={handleSave}
                hasChanges={hasChanges(ach._id)}
                saving={saving}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
