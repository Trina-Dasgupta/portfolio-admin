import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/achievement`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (data.success) {
          const formatted = data.data?.map((ach) => ({
            _id: ach._id,
            companyLogo: ach.companyLogo || "/placeholder.png",
            title: ach.title || "",
            timeLine: ach.timeLine || "",
            descriptionTitle: ach.descriptionTitle || "",
            descriptionPoints: ach.descriptionPoints || [],
            images: ach.images || [],
            selectedLogoFile: null,
            selectedImageFiles: [],
          }));
          setAchievements(formatted);
          setOriginalData(formatted);
        } else {
          toast.error(data.message || "Failed to fetch achievements");
        }
      } catch (error) {
        toast.error("Error fetching achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    achievements,
    setAchievements,
    originalData,
    setOriginalData,
    loading,
  };
};
