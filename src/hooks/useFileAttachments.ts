import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

/**
 * Creates a FileList from an array of File objects
 * @param files Array of File objects to convert to FileList
 * @returns FileList object
 */
const createFileListFromArray = (files: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};

/**
 * Custom hook to handle file attachment operations including:
 * - File uploads via button
 * - Drag and drop file handling
 * - File validation
 * - File removal
 */
export function useFileAttachments() {
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload via upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) => file.type.startsWith('image/') || file.type.startsWith('text/')
      );

      if (validFiles.length === selectedFiles.length) {
        setAttachments(createFileListFromArray(validFiles));
      } else {
        console.error('Only image and text files are allowed');
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) => file.type.startsWith('image/') || file.type.startsWith('text/')
        );

        if (validFiles.length === files.length) {
          setAttachments(createFileListFromArray(validFiles));
        } else {
          console.error('Only image and text files are allowed');
        }
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) => file.type.startsWith('image/') || file.type.startsWith('text/')
      );

      if (validFiles.length === droppedFilesArray.length) {
        setAttachments(createFileListFromArray(validFiles));
      } else {
        console.error('Only image and text files are allowed!');
      }
    }
    setIsDragging(false);
  };

  // Also expose the utility function for consumers of this hook
  return {
    attachments,
    setAttachments,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    handlePaste,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
    createFileListFromArray,
  };
}
