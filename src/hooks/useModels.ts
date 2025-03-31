import type { AIModel } from '@/config/models';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

export interface GroupedModels {
  [provider: string]: AIModel[];
}

/**
 * Hook to fetch and manage AI model data from the API
 */
export const useModels = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [groupedModels, setGroupedModels] = useState<GroupedModels>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        // Fetch grouped models for UI display
        const response = await fetch(`${API_BASE_URL}/api/models?grouped=true`);

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Set grouped models
        setGroupedModels(data.models || {});

        // Also flatten the groups for convenience
        const allModels: AIModel[] = Object.values(data.models || {}).flat() as AIModel[];
        setModels(allModels);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, groupedModels, loading, error };
};

export default useModels;
