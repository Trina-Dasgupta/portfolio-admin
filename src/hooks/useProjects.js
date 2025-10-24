import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/project`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (data.success) {
          const formattedData = data.data?.map((project) => {
            return {
              _id: project._id || "",
              name: project.name || "",
              navLink: project.navLink || "",
              description: project.description || "",
              readmeContent: project.readmeContent || "",
              gitHubLink: project.gitHubLink || "",
              liveLink: project.liveLink || "",
              images: project.images || [],
              tags: project.tags || [],
              developmentSummary: project.developmentSummary || [],
              languagesUsed: project.languagesUsed || [],
              stack: project.stack || "",
              selectedImageFiles: [],
            };
          });
          setProjects(formattedData);
          setOriginalData(formattedData);
        } else {
          toast.error(data.message || "Failed to fetch projects");
        }
      } catch (error) {
        toast.error("Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { projects, setProjects, originalData, setOriginalData, loading };
};
