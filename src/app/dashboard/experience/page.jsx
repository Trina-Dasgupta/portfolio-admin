"use client";
import { useExperience } from "@/hooks/useExperience";
import { useS3Upload } from "@/hooks/useS3Upload";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CreateExperienceDialog } from "./CreateExperienceDialog";
import { ExperienceCard } from "./ExperienceCard";

export default function ExperiencePage() {
  const {
    experiences,
    loading,
    updateExperienceField,
    hasChanges,
    saveExperience,
  } = useExperience();
  const [saving, setSaving] = useState(false);
  const { upload } = useS3Upload();

  const updateExperience = (id, field, value) => {
    updateExperienceField(id, field, value);
  };

  const handleSave = async (id) => {
    setSaving(true);
    await saveExperience(id, upload);
    setSaving(false);
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
            <h1 className="text-3xl font-bold">Experience</h1>
            <p className=" mt-1">Manage your experience</p>
          </div>
          <CreateExperienceDialog />
        </div>

        <div className="space-y-3">
          {experiences.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  No Experience yet
                </h3>
                <p className="mb-4">
                  Get started by creating your first experience
                </p>
                <CreateExperienceDialog />
              </div>
            </div>
          ) : (
            experiences.map((exp, idx) => (
              <ExperienceCard
                key={exp._id}
                exp={exp}
                index={idx}
                onUpdate={updateExperience}
                onSave={handleSave}
                hasChanges={hasChanges(exp._id)}
                saving={saving}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
