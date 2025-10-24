import { useState } from "react";

export const useS3Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Single file upload
  const upload = async (file) => {
    setUploading(true);
    setProgress(0);

    try {
      // Get upload URL
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getS3UploadURL`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            fileName: file.name, 
            contentType: file.type
          }),
        }
      );

      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to get upload URL");

      setProgress(30);

      const { url, s3ObjectKey, useLocal, key } = data.data;

      let finalURL;

      if (useLocal) {
        // Upload to local server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('key', key || s3ObjectKey);

        const uploadRes = await fetch(url, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        setProgress(70);

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || "Local upload failed");
        }

        finalURL = uploadData.data.url;
      } else {
        // Upload to S3
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        setProgress(80);
        finalURL = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}${s3ObjectKey}`;
      }

      setProgress(100);
      return finalURL;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Multiple files upload
  const uploadMultiple = async (files) => {
    setUploading(true);
    setProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Get upload URL for each file
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getS3UploadURL`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
              fileName: file.name, 
              contentType: file.type
            }),
          }
        );

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const { url, s3ObjectKey, useLocal, key } = data.data;

        if (useLocal) {
          // Upload to local server
          const formData = new FormData();
          formData.append('file', file);
          formData.append('key', key || s3ObjectKey);

          const uploadRes = await fetch(url, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadData.success) throw new Error(uploadData.message);

          return uploadData.data.url;
        } else {
          // Upload to S3
          await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}${s3ObjectKey}`;
        }
      });

      // Wait for all uploads to complete
      const urls = await Promise.all(uploadPromises);
      
      setProgress(100);
      return urls;
    } catch (error) {
      console.error("Multiple upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploadMultiple, uploading, progress };
};