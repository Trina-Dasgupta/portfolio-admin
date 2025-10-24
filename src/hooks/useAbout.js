"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useS3Upload } from "@/hooks/useS3Upload";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const INITIAL_FORM = {
  profilePic: "",
  selectedFile: null,
  name: "",
  role: "",
  miniDescription: "",
  description: "",
  currentFocus: "",
  skills: [],
  aboutReadme: "",
};

export function useAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [originalData, setOriginalData] = useState({});
  const { upload } = useS3Upload();

  useEffect(() => {
    fetchData();
    return () => {
      if (formData.profilePic?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.profilePic);
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/about`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        const formatted = {
          profilePic: data.data.profilePic || "",
          name: data.data.name || "",
          role: data.data.role || "",
          miniDescription: data.data.miniDescription || "",
          description: data.data.description || "",
          currentFocus: data.data.currentFocus || "",
          skills: data.data.skills || [],
          aboutReadme: data.data.aboutReadme || "",
        };

        setFormData(formatted);
        setOriginalData(formatted);
      } else {
        toast.error("Failed to load data");
      }
    } catch (err) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      selectedFile: file,
      profilePic: preview,
    }));
  };

  const getChangedFields = () => {
    const changes = {};

    Object.keys(formData).forEach((key) => {
      if (key === "selectedFile" || key === "profilePic") return;

      if (key === "skills") {
        const current = [...formData.skills].sort();
        const original = [...(originalData.skills || [])].sort();
        if (JSON.stringify(current) !== JSON.stringify(original)) {
          changes[key] = formData.skills;
        }
      } else if (
        formData[key]?.toString().trim() !==
        originalData[key]?.toString().trim()
      ) {
        changes[key] = formData[key];
      }
    });

    return changes;
  };

  const hasChanges = () => {
    if (formData.selectedFile) return true;
    return Object.keys(getChangedFields()).length > 0;
  };

  const handleSubmit = async () => {
    const changedPayload = getChangedFields();
    if (!hasChanges()) return;

    setSaving(true);

    try {
      if (formData.selectedFile) {
        const newImageKey = await upload(formData.selectedFile);
        changedPayload.profilePic = newImageKey;
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/about`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Updated successfully!");
        const newOriginal = { ...formData, selectedFile: null };
        if (changedPayload.profilePic) {
          newOriginal.profilePic = changedPayload.profilePic;
        }
        setOriginalData(newOriginal);
        setFormData((prev) => ({ ...prev, selectedFile: null }));
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Error updating data");
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    formData,
    handleChange,
    handleImageUpload,
    handleSubmit,
    hasChanges,
    fetchData,
    setFormData
  };
}
