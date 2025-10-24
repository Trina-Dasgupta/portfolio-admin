import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Code, Eye } from "lucide-react";
import ReadmeRenderer from "./ReadmeRenderer";

export default function ReadmeEditor({ content, onChange }) {
  return (
    <div>
      <div className="mx-auto">
        <div className="space-y-3">
          <Label
            htmlFor="readme-content"
            className="text-sm font-semibold text-foreground sm:text-base"
          >
            README Content
          </Label>

          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="edit">
                <Code className="w-4 h-4 mr-2" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-0">
              <div className="rounded-lg overflow-hidden dark:bg-[#0D1117] max-h-[500px] overflow-y-scroll">
                <Textarea
                  id="readme-content"
                  value={content}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Write your README content in Markdown..."
                  className="min-h-[500px] font-mono text-sm dark:bg-[#0D1117] border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground sm:text-base"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="rounded-lg dark:bg-[#0D1117] p-4 max-h-[500px] overflow-y-scroll">
                {content ? (
                  <div className=" text-gray-200 max-w-full mx-auto break-words">
                    <ReadmeRenderer content={content} />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No content to preview</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
