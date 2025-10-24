"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import { CreateBlogDialog } from "./CreateBlogDialog";

export default function BlogPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (data.success) {
          const formattedData = data.data.map((blog) => ({
            _id: blog._id,
            title: blog.title || "",
            excerpt: blog.excerpt || "",
            date: blog.date || "",
            readTime: blog.readTime || "",
            category: blog.category || "",
            mediumLink: blog.mediumLink || "",
          }));
          setFormData(formattedData);
          setOriginalData(formattedData);
        } else {
          toast.error("Failed to load data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value, blogId) => {
    setFormData((prev) =>
      prev.map((blog) =>
        blog._id === blogId ? { ...blog, [field]: value } : blog
      )
    );
  };

  const handleSubmit = async (blogId) => {
    const current = formData.find((blog) => blog._id === blogId);
    const original = originalData.find((blog) => blog._id === blogId);
    if (!current || !original) return;

    const payload = {};
    Object.keys(current).forEach((key) => {
      if (key !== "_id" && current[key].trim() !== original[key].trim()) {
        payload[key] = current[key];
      }
    });
    if (Object.keys(payload).length === 0) return;

    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/${blogId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Changes saved successfully!");
        setOriginalData((prev) =>
          prev.map((b) => (b._id === blogId ? { ...b, ...payload } : b))
        );
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update");
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
            <h1 className="text-3xl font-bold">Blogs</h1>
            <p className=" mt-1">Manage your blogs</p>
          </div>
          <CreateBlogDialog
            setMainFormData={setFormData}
            setOriginalData={setOriginalData}
          />
        </div>

        <div className="space-y-3">
          {formData.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <div className="max-w-sm mx-auto">
                <h3 className="text-lg font-semibold mb-2">No Blog yet</h3>
                <p className="mb-4">Get started by creating your first blog</p>
                <CreateBlogDialog
                  setMainFormData={setFormData}
                  setOriginalData={setOriginalData}
                />
              </div>
            </div>
          ) : (
            formData.map((blog, idx) => {
              const originalBlog = originalData.find((b) => b._id === blog._id);
              return (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  originalBlog={originalBlog}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  saving={saving}
                  index={idx}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
