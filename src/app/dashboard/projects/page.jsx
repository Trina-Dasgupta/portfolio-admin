"use client";

import { useProjects } from "@/hooks/useProjects";
import { useS3Upload } from "@/hooks/useS3Upload";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectCard } from "./ProjectCard";

export default function ProjectsPage() {
  const { projects, setProjects, originalData, setOriginalData, loading } =
    useProjects();
  const [saving, setSaving] = useState(false);
  const { upload } = useS3Upload();

  const updateProject = useCallback(
    (id, field, value) => {
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === id ? { ...proj, [field]: value } : proj
        )
      );
    },
    [setProjects]
  );

  const getChangedFields = useCallback(
    (id) => {
      const current = projects.find((p) => p._id === id);
      const original = originalData.find((p) => p._id === id);
      if (!current || !original) return null;

      const changedFields = {};
      const keys = Object.keys(current).filter(
        (k) => k !== "_id" && k !== "selectedImageFiles"
      );

      keys.forEach((key) => {
        const currentValue = current[key];
        const originalValue = original[key];

        if (Array.isArray(currentValue)) {
          if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
            changedFields[key] = currentValue;
          }
        } else if (typeof currentValue === "string") {
          if (currentValue.trim() !== (originalValue?.trim() || "")) {
            changedFields[key] = currentValue;
          }
        } else {
          // for numbers, booleans, null, etc.
          if (currentValue !== originalValue) {
            changedFields[key] = currentValue;
          }
        }
      });

      return Object.keys(changedFields).length > 0 ? changedFields : null;
    },
    [projects, originalData]
  );

  const hasChanges = useCallback(
    (id) => {
      return getChangedFields(id) !== null;
    },
    [getChangedFields]
  );

  const handleSave = async (id) => {
    const changedFields = getChangedFields(id);
    if (!changedFields) return;

    setSaving(true);

    try {
      const projectData = projects.find((p) => p._id === id);

      if (changedFields.images) {
        const uploadedImages = await Promise.all(
          changedFields.images.map(async (imgObj) => {
            if (imgObj.file) {
              try {
                const uploaded = await upload(imgObj.file);
                URL.revokeObjectURL(imgObj.url);
                return uploaded;
              } catch (err) {
                toast.error(`Failed to upload image: ${imgObj.file.name}`);
                throw err;
              }
            }
            return imgObj;
          })
        );

        changedFields.images = uploadedImages;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/project/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changedFields),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Project updated successfully!");

        setProjects((prev) =>
          prev.map((proj) =>
            proj._id === id
              ? {
                  ...projectData,
                  images: changedFields.images || projectData.images,
                }
              : proj
          )
        );
        setOriginalData((prev) =>
          prev.map((proj) =>
            proj._id === id
              ? {
                  ...projectData,
                  images: changedFields.images || projectData.images,
                }
              : proj
          )
        );
      } else {
        toast.error(data.errors?.[0] || "Failed to update project");
      }
    } catch (error) {
      toast.error("Error saving project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-[800px]:p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center max-[800px]:flex-col max-[800px]:items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className=" mt-1">Manage your project portfolio</p>
          </div>
          <CreateProjectDialog
            setOriginalData={setOriginalData}
            setProjects={setProjects}
          />
        </div>

        {projects.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <div className="max-w-sm mx-auto">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="mb-4">Get started by creating your first project</p>
              <CreateProjectDialog
                setOriginalData={setOriginalData}
                setProjects={setProjects}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={idx}
                onUpdate={updateProject}
                onSave={handleSave}
                hasChanges={hasChanges(project._id)}
                saving={saving}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
