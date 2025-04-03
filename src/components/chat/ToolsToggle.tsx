import { useState } from 'react';

interface ToolsToggleProps {
  onToggle: (enabled: boolean) => void;
  initialEnabled?: boolean;
}

export function ToolsToggle({ onToggle, initialEnabled = false }: ToolsToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onToggle(newValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="tools-toggle"
        className="text-sm font-medium cursor-pointer"
        onClick={handleToggle}
      >
        Use web tools
      </label>
      <button
        id="tools-toggle"
        type="button"
        role="switch"
        aria-checked={enabled}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
        onClick={handleToggle}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
