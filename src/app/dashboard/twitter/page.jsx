"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTwitter } from "@/hooks/useTwitter";
import { Loader2, Save } from "lucide-react";

export default function TwitterPage() {
  const {
    loading,
    saving,
    twitterIds,
    tweetId,
    setTweetId,
    handleAddTweet,
    handleSubmit,
    hasChanges,
  } = useTwitter();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTweet();
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
        <h1 className="text-3xl font-bold text-foreground max-[800px]:text-xl">
          Twitter Updates Page
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>TweetId Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>TweetId</Label>
                <div className="flex gap-2">
                  <Input
                    value={tweetId}
                    onChange={(e) => setTweetId(e.target.value)}
                    placeholder="Enter your latest tweetId"
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={handleAddTweet} disabled={!tweetId.trim()}>
                    Add
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {twitterIds.length} / 6 IDs Added
              </p>

              <div className="grid gap-2">
                {twitterIds.map((id, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-md bg-muted text-sm font-mono"
                  >
                    {id}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {hasChanges() ? (
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
                  onClick={handleSubmit}
                  disabled={!hasChanges() || saving}
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
      </div>
    </div>
  );
}
