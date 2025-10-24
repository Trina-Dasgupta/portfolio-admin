import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { TagInput } from "@/components/TagInput";
import { KeyValueInput } from "@/components/KeyValueInput";
import { LanguageInput } from "@/components/LanguageInput";
import ReadmeEditor from "@/components/ReadmeEditor";
import { ImageGallery } from "@/components/ImageGallery";

export const ProjectCard = ({
  project,
  index,
  onUpdate,
  onSave,
  hasChanges,
  saving,
}) => {
  const updateField = (field, value) => onUpdate(project._id, field, value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Project {index + 1}: {project.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          id="name"
          label="Name"
          value={project.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Enter project name"
        />

        <FormField
          id="name"
          label="Navigation Link"
          value={project.navLink}
          onChange={(e) => updateField("navLink", e.target.value)}
          placeholder="Enter project navLink"
        />

        <FormTextarea
          id="desc"
          label="Description"
          value={project.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Enter project description"
        />

        <ReadmeEditor
          content={project.readmeContent}
          onChange={(val) => updateField("readmeContent", val)}
        />

        <FormField
          type="url"
          id="gitHubLink"
          label="GitHub Link"
          value={project.gitHubLink}
          onChange={(e) => updateField("gitHubLink", e.target.value)}
          placeholder="Enter project GitHub Link"
        />

        <FormField
          type="url"
          id="liveLink"
          label="Live link"
          value={project.liveLink}
          onChange={(e) => updateField("liveLink", e.target.value)}
          placeholder="Enter project Live Link"
        />

        <FormField
          id="stack"
          label="Stack"
          value={project.stack}
          onChange={(e) => updateField("stack", e.target.value)}
          placeholder="Enter project stack"
        />

        <ImageGallery
          selectedImageFiles={project.selectedImageFiles}
          images={project.images}
          onImagesChange={(imgs, files) => {
            updateField("images", imgs);
            updateField("selectedImageFiles", files);
          }}
        />

        <TagInput
          label="Tags"
          tags={project.tags.map((tag) => tag.topic)}
          onAdd={(val) =>
            updateField("tags", [...project.tags, { topic: val }])
          }
          onRemove={(i) =>
            updateField(
              "tags",
              project.tags.filter((_, idx) => idx !== i)
            )
          }
          placeholder="Add tag"
        />

        <KeyValueInput
          label="Development Summary"
          items={project.developmentSummary}
          onAdd={(item) =>
            updateField("developmentSummary", [
              ...project.developmentSummary,
              item,
            ])
          }
          onRemove={(i) =>
            updateField(
              "developmentSummary",
              project.developmentSummary.filter((_, idx) => idx !== i)
            )
          }
          keyPlaceholder="Title"
          valuePlaceholder="Value"
        />

        <LanguageInput
          languages={project.languagesUsed}
          onAdd={(lang) =>
            updateField("languagesUsed", [...project.languagesUsed, lang])
          }
          onRemove={(i) =>
            updateField(
              "languagesUsed",
              project.languagesUsed.filter((_, idx) => idx !== i)
            )
          }
        />

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm">
            {hasChanges ? (
              <span className="text-amber-600 font-medium">
                Unsaved changes
              </span>
            ) : (
              <span className="text-green-600 font-medium">
                All changes saved
              </span>
            )}
          </p>
          <button
            onClick={() => onSave(project._id)}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
