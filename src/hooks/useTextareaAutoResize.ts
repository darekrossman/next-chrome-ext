import { type ChangeEvent, useEffect, useRef } from 'react';

/**
 * Custom hook to manage textarea auto-resizing
 * - Automatically adjusts textarea height based on content
 * - Handles resetting height when input is cleared
 * - Limits maximum height to avoid excessive expansion
 */
export function useTextareaAutoResize(maxHeight = 150) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  };

  // Reset textarea height when input is cleared
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'value' &&
          !textarea.value
        ) {
          textarea.style.height = 'auto';
        }
      });
    });

    observer.observe(textarea, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    textareaRef,
    handleTextareaChange,
  };
}
