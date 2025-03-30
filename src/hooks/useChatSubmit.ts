import type { KeyboardEvent, RefObject } from 'react';

interface UseChatSubmitProps {
  input: string;
  attachments: FileList | null;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    options?: Record<string, unknown>
  ) => void;
  setAttachments: (attachments: FileList | null) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

/**
 * Custom hook for handling chat form submission with attachments
 * - Handles form submissions with file attachments
 * - Provides keyboard shortcut support (Enter to submit)
 * - Resets attachments after submission
 */
export function useChatSubmit({
  input,
  attachments,
  handleSubmit,
  setAttachments,
  textareaRef,
}: UseChatSubmitProps) {
  // Dedicated submit handler that includes attachments
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const options = attachments ? { experimental_attachments: attachments } : {};
    handleSubmit(event, options);
    setAttachments(null);

    // Reset textarea height after submission
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle keyboard shortcuts (Enter to submit)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        // Create a synthetic form event to pass to our submit handler
        const formEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        }) as unknown as React.FormEvent<HTMLFormElement>;
        handleFormSubmit(formEvent);
      }
    }
  };

  return {
    handleFormSubmit,
    handleKeyDown,
  };
}
