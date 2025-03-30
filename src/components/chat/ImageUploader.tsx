'use client';

import { ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';

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

  // Generate unique IDs for files
  const getFileId = (file: File, index: number) => {
    return `${file.name.replace(/[^a-z0-9]/gi, '-')}-${file.size}-${index}`;
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
      <Button
        type="button"
        onClick={handleClick}
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-white hover:bg-[#333333] rounded-full w-10 h-10 p-0"
        aria-label="Attach image"
      >
        <ImageIcon size={18} />
      </Button>

      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 absolute -top-20 left-0 bg-[#252525] p-2 rounded border border-[#444444]">
          {files.map((file, index) => {
            const fileId = getFileId(file, index);
            return (
              <div key={fileId} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Attachment ${index + 1}`}
                  className="h-14 w-14 object-cover rounded border border-[#444444]"
                />
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => {
                    const newFiles = files.filter((_, i) => i !== index);
                    setFiles(newFiles);
                    onUpload(newFiles);
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
