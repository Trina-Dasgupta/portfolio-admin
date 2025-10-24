"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const INITIAL_FORM = {
  companyLogo: "/placeholder.png",
  title: "",
  location: "",
  timeLine: "",
  isCurrent: false,
  keyAchievements: [],
  technologiesUsed: [],
};

export const useExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/experience`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (data.success) {
          const formatted = data.data?.map((exp) => ({
            _id: exp._id,
            companyLogo: exp.companyLogo || "/placeholder.png",
            title: exp.title || "",
            location: exp.location || "",
            timeLine: exp.timeLine || "",
            isCurrent: exp.isCurrent || false,
            keyAchievements: exp.keyAchievements || [],
            technologiesUsed: exp.technologiesUsed || [],
          }));
          setExperiences(formatted);
          setOriginalData(formatted);
        } else {
          toast.error(data.message || "Failed to fetch experiences");
        }
      } catch (error) {
        toast.error("Error fetching experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createExperience = async (formData, upload) => {
    try {
      let companyLogoUrl = formData.companyLogo;

      if (formData.selectedFile) {
        companyLogoUrl = await upload(formData.selectedFile);
      } else {
        toast.error("Please select a company logo");
        return null;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/experience`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, companyLogo: companyLogoUrl }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Experience added successfully!");
        const newEntry = { _id: data.data._id, ...data.data };
        setExperiences((prev) => [...prev, newEntry]);
        setOriginalData((prev) => [...prev, newEntry]);
        return newEntry;
      } else {
        console.log(data);
        toast.error(data.errors[0] || "Failed to add experience");
        return null;
      }
    } catch (error) {
      toast.error(error.message || "Server error");
      return null;
    }
  };

  const updateExperienceField = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp._id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const getChangedFields = (id) => {
    const current = experiences.find((exp) => exp._id === id);
    const original = originalData.find((exp) => exp._id === id);
    if (!current || !original) return null;

    const changedFields = {};
    const keys = [
      "companyLogo",
      "title",
      "location",
      "timeLine",
      "isCurrent",
      "keyAchievements",
      "technologiesUsed",
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

  const saveExperience = async (id, upload) => {
    const changedFields = getChangedFields(id);
    if (!changedFields) return false;

    try {
      const expData = experiences.find((exp) => exp._id === id);

      // Upload new logo if it's a blob and logo field has changed
      if (
        changedFields.companyLogo?.startsWith("blob:") &&
        expData.selectedFile
      ) {
        try {
          changedFields.companyLogo = await upload(expData.selectedFile);
        } catch (err) {
          toast.error("Failed to upload image");
          return false;
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/experience/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changedFields),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Experience updated successfully!");
        setOriginalData((prev) =>
          prev.map((exp) =>
            exp._id === id ? { ...experiences.find((e) => e._id === id) } : exp
          )
        );
        return true;
      } else {
        toast.error(data.message || "Failed to update experience");
        return false;
      }
    } catch (error) {
      toast.error("Error saving experience");
      return false;
    }
  };

  return {
    experiences,
    setExperiences,
    originalData,
    setOriginalData,
    loading,
    createExperience,
    updateExperienceField,
    getChangedFields,
    hasChanges,
    saveExperience,
    INITIAL_FORM,
  };
};
