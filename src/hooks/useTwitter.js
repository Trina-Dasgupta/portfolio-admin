"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useTwitter() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [twitterIds, setTwitterIds] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [tweetId, setTweetId] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/tweetIds`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setTwitterIds(data.data.tweetIds);
        setOriginalData(data.data.tweetIds);
      } else {
        toast.error("Failed to load data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTweet = () => {
    if (!tweetId.trim()) return toast.error("Tweet ID cannot be empty");

    const cleanId = tweetId.trim();

    if (cleanId.length < 19 || isNaN(Number(cleanId))) {
      return toast.error("Invalid Tweet ID");
    }

    if (twitterIds.includes(cleanId)) {
      return toast.error("Tweet ID already exists");
    }

    const updated = [cleanId, ...twitterIds].slice(0, 6);
    setTwitterIds(updated);
    setTweetId("");
  };

  const hasChanges = () => {
    return JSON.stringify(twitterIds) !== JSON.stringify(originalData);
  };

  const handleSubmit = async () => {
    if (!hasChanges()) return;

    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/tweetIds`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetIds: twitterIds }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Changes saved successfully!");
        setOriginalData(twitterIds);
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Error updating data");
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    twitterIds,
    originalData,
    tweetId,
    setTweetId,
    handleAddTweet,
    handleSubmit,
    hasChanges,
  };
}
