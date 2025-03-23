"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  endpoint: string;
}

const ImageUpload = ({ value, onChange, endpoint }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full">
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            ref={fileInputRef}
          />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2Icon className="size-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">
                Uploading image...
              </p>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-4 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloudIcon className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to upload an image</p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
