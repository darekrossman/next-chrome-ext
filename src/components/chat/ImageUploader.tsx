"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      onUpload(selectedFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        multiple
      />
      <Button type="button" onClick={handleClick} variant="outline" size="sm">
        Attach Image
      </Button>

      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index}`}
                className="h-16 w-16 object-cover rounded"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => {
                  const newFiles = files.filter((_, i) => i !== index);
                  setFiles(newFiles);
                  onUpload(newFiles);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
