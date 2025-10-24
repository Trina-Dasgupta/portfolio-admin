import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import { ImageGallery } from "@/components/ImageGallery";
import { KeyValueInput } from "@/components/KeyValueInput";
import { LanguageInput } from "@/components/LanguageInput";
import ReadmeEditor from "@/components/ReadmeEditor";
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
import { useS3Upload } from "@/hooks/useS3Upload";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const INITIAL_FORM = {
  name: "",
  navLink: "",
  description: "",
  readmeContent: "",
  gitHubLink: "",
  liveLink: "",
  images: [],
  tags: [],
  developmentSummary: [],
  languagesUsed: [],
  stack: "",
};

export const CreateProjectDialog = ({ setOriginalData, setProjects }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { upload, uploading } = useS3Upload();

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setSelectedImageFiles(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      let uploadedImages = [...formData.images];
      for (let i = 0; i < uploadedImages.length; i++) {
        if (uploadedImages[i].file) {
          const url = await upload(uploadedImages[i].file);
          uploadedImages[i] = url;
        }
      }

      const projectData = {
        ...formData,
        images: uploadedImages,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(projectData),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Project added successfully!");
        const newEntry = { _id: data.data._id, ...data.data, selectedImageFiles: [] };
        setProjects((prev) => [...prev, newEntry]);
        setOriginalData((prev) => [...prev, newEntry]);
        resetForm();
        document.getElementById("close-project-dialog")?.click();
      } else {
        toast.error(data.errors[0] || "Failed to add experience");
        updateField("images", uploadedImages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus /> Add Project
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Create new Project</DialogTitle>
            <DialogDescription>
              Fill the details and click Save to add a new project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4 p-2">
            <FormField
              id="name"
              label="Name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter project name"
            />

            <FormField
              id="navLink"
              label="Navigation Link"
              value={formData.navLink}
              onChange={(e) => updateField("navLink", e.target.value)}
              placeholder="Enter project navLink"
            />

            <FormTextarea
              id="desc"
              label="Description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Enter project description"
            />

            <div className="overflow-x-hidden">
              <ReadmeEditor
                content={formData.readmeContent}
                onChange={(val) => updateField("readmeContent", val)}
              />
            </div>

            <FormField
              type="url"
              id="gitHubLink"
              label="GitHub Link"
              value={formData.gitHubLink}
              onChange={(e) => updateField("gitHubLink", e.target.value)}
              placeholder="Enter project GitHub Link"
            />

            <FormField
              type="url"
              id="liveLink"
              label="Live link"
              value={formData.liveLink}
              onChange={(e) => updateField("liveLink", e.target.value)}
              placeholder="Enter project Live Link"
            />

            <FormField
              id="stack"
              label="Stack"
              value={formData.stack}
              onChange={(e) => updateField("stack", e.target.value)}
              placeholder="Enter project stack"
            />

            <ImageGallery
              selectedImageFiles={selectedImageFiles}
              images={formData.images}
              onImagesChange={(imgs, files) => {
                updateField("images", imgs);
                setSelectedImageFiles(files);
              }}
            />

            <TagInput
              label="Tags"
              tags={formData.tags.map((tag) => tag.topic)}
              onAdd={(val) =>
                updateField("tags", [...formData.tags, { topic: val }])
              }
              onRemove={(i) =>
                updateField(
                  "tags",
                  formData.tags.filter((_, idx) => idx !== i)
                )
              }
              placeholder="Add tag"
            />

            <KeyValueInput
              label="Development Summary"
              items={formData.developmentSummary}
              onAdd={(item) =>
                updateField("developmentSummary", [
                  ...formData.developmentSummary,
                  item,
                ])
              }
              onRemove={(i) =>
                updateField(
                  "developmentSummary",
                  formData.developmentSummary.filter((_, idx) => idx !== i)
                )
              }
              keyPlaceholder="Title"
              valuePlaceholder="Value"
            />

            <LanguageInput
              languages={formData.languagesUsed}
              onAdd={(lang) =>
                updateField("languagesUsed", [...formData.languagesUsed, lang])
              }
              onRemove={(i) =>
                updateField(
                  "languagesUsed",
                  formData.languagesUsed.filter((_, idx) => idx !== i)
                )
              }
            />

            
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" id="close-project-dialog">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
