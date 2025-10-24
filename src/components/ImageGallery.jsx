"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { Label } from "./ui/label";
import Image from "next/image";

export const ImageGallery = ({
  selectedImageFiles,
  images,
  onImagesChange,
  maxImages = 12,
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => revokeBlobUrl(img));
    };
  }, []);

  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 5MB limit`);
    }
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type
      )
    ) {
      throw new Error(`Unsupported format`);
    }
  };

  const createBlobUrl = (file) => URL.createObjectURL(file);
  const revokeBlobUrl = (url) => URL.revokeObjectURL(url);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      try {
        validateImage(file);
        validFiles.push(file);
      } catch (error) {
        alert(`${file.name}: ${error.message}`);
      }
    }

    if (validFiles.length > 0) {
      const newBlobUrls = validFiles.map(createBlobUrl);
      onImagesChange(
        [...images, ...newBlobUrls.map((url, i) => ({ file: validFiles[i], url }))],
        [...selectedImageFiles, ...validFiles]
      );
    }
  };

  const removeImage = (index) => {
    revokeBlobUrl(images[index]);
    const newImages = images.filter((_, i) => i !== index);
    const newFiles = selectedImageFiles.filter((_, i) => i !== index);
    onImagesChange(newImages, newFiles);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const newFiles = [...selectedImageFiles];
    const draggedImage = newImages[draggedIndex];
    const draggedFile = newFiles[draggedIndex];

    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);

    onImagesChange(newImages, newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Label className="text-sm font-semibold text-foreground sm:text-base">
          Project Images{" "}
          <span className="text-muted-foreground">
            ({images.length}/{maxImages})
          </span>
        </Label>
        {images.length < maxImages && (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:opacity-75 transition-opacity text-sm font-medium">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Images</span>
              <span className="sm:hidden">Upload</span>
            </div>
          </label>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 md:p-12 text-center bg-muted/30">
          <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm sm:text-base text-muted-foreground mb-3 font-medium">
            No images uploaded yet
          </p>
          <label className="cursor-pointer inline-block">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <span className="text-sm sm:text-base text-primary hover:underline font-semibold">
              Click to upload images
            </span>
          </label>
        </div>
      ) : (
        /* Simplified grid with delete button below each image instead of hover icons */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {images.map((img, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group flex flex-col gap-2 transition-all duration-200 ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              {/* Image container with drag indicator */}
              <div
                className={`relative aspect-video border-2 rounded-lg overflow-hidden bg-muted cursor-move transition-all duration-200 ${
                  draggedIndex === index
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                {/* <Image
                  src={img?.url || img || "/placeholder.svg"}
                  alt={`Project image ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                /> */}

                {/* Image number badge - always visible */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded text-xs font-semibold text-white">
                  #{index + 1}
                </div>

                {/* Drag indicator on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-xs font-medium text-white/80 bg-black/40 px-2 py-1 rounded">
                    Drag to reorder
                  </span>
                </div>
              </div>

              {/* Delete button below image - always visible */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors duration-200 text-sm font-medium border border-destructive/20 hover:border-destructive/40"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        💡 Drag images to reorder • Max 5MB per image • Supports: JPEG, PNG,
        WebP, GIF
      </p>
    </div>
  );
};
