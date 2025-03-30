'use client';

import { useEffect, useState } from 'react';

// Generate unique ID for files
const getFileId = (file: File, index: number) => {
  return `${file.name.replace(/[^a-z0-9]/gi, '-')}-${file.size}-${index}`;
};

// Creates a FileList from an array of File objects
const createFileListFromArray = (files: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};

// Text file preview component
function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === 'string' ? text.slice(0, 100) : '');
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && '...'}
    </div>
  );
}

interface AttachmentPreviewsProps {
  attachments: FileList;
  setAttachments: (attachments: FileList | null) => void;
}

/**
 * Component for displaying previews of file attachments
 * with the ability to remove them
 *
 * Supports:
 * - Image previews
 * - PDF document icons
 * - Text file previews
 */
export function AttachmentPreviews({ attachments, setAttachments }: AttachmentPreviewsProps) {
  const handleRemoveAttachment = (index: number) => {
    const filesArray = Array.from(attachments);
    const filteredFiles = filesArray.filter((_, i) => i !== index);
    setAttachments(filteredFiles.length > 0 ? createFileListFromArray(filteredFiles) : null);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {Array.from(attachments).map((file, index) => {
        const fileId = getFileId(file, index);

        if (file.type.startsWith('image')) {
          return (
            <div key={fileId} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Attachment ${file.name}`}
                className="h-16 w-16 object-cover rounded border"
              />
              <button
                type="button"
                aria-label={`Remove image ${file.name}`}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => handleRemoveAttachment(index)}
              >
                ×
              </button>
            </div>
          );
        }

        if (file.type === 'application/pdf') {
          return (
            <div key={fileId} className="relative">
              <div className="h-16 w-16 border rounded flex items-center justify-center bg-background">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-labelledby={`pdf-icon-title-${fileId}`}
                  role="img"
                >
                  <title id={`pdf-icon-title-${fileId}`}>PDF document</title>
                  <path
                    d="M8 2V6H4V22H20V2H8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 13H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <button
                type="button"
                aria-label={`Remove PDF ${file.name}`}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => handleRemoveAttachment(index)}
              >
                ×
              </button>
            </div>
          );
        }

        if (file.type.startsWith('text')) {
          return (
            <div key={fileId} className="relative">
              <div className="text-xs w-24 h-16 overflow-hidden border p-2 rounded">
                <TextFilePreview file={file} />
              </div>
              <button
                type="button"
                aria-label={`Remove text ${file.name}`}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => handleRemoveAttachment(index)}
              >
                ×
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
