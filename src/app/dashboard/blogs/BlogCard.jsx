"use client";

import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

export default function BlogCard({
  blog,
  originalBlog,
  onChange,
  onSubmit,
  saving,
  index,
}) {
  const fields = [
    "title",
    "excerpt",
    "date",
    "readTime",
    "category",
    "mediumLink",
  ];

  const hasChanges = fields.some(
    (key) => blog[key].trim() !== originalBlog[key].trim()
  );

  const handleFieldChange = (field, value) => onChange(field, value, blog._id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Blog {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {fields.map((field) => (
            <div className="space-y-2" key={field}>
              {field === "excerpt" ? (
                <FormTextarea
                  id={field}
                  label={field[0].toUpperCase() + field.slice(1)}
                  value={blog[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={`Enter the blog ${field}`}
                />
              ) : (
                <FormField
                  id={field}
                  label={field[0].toUpperCase() + field.slice(1)}
                  value={blog[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={`Enter the blog ${field}`}
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              {hasChanges ? (
                <span className="text-amber-500 font-medium">
                  Unsaved changes
                </span>
              ) : (
                <span className="text-green-500 font-medium">
                  All changes saved
                </span>
              )}
            </p>
            <Button
              onClick={() => onSubmit(blog._id)}
              disabled={!hasChanges || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
