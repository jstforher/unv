import { useState, useEffect, useCallback } from 'react';
import { Memory, SiteSettings } from '../types/memory';
import { memoriesService, settingsService } from '../services/memories';
import { ApiError } from '../types/api';

interface UseMemoriesReturn {
  memories: Memory[];
  featuredMemories: Memory[];
  loading: boolean;
  error: ApiError | null;
  settings: SiteSettings | null;
  refreshMemories: () => Promise<void>;
  getMemoryById: (id: string) => Memory | undefined;
  loadMoreMemories: () => Promise<void>;
  hasMore: boolean;
}

export const useMemories = (category?: string, featured?: boolean): UseMemoriesReturn => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [featuredMemories, setFeaturedMemories] = useState<Memory[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const refreshMemories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [memoriesResponse, featuredResponse, settingsResponse] = await Promise.all([
        memoriesService.getMemories({ category, is_featured: featured, ordering: '-created_at' }),
        memoriesService.getFeaturedMemories(),
        settingsService.getSettings()
      ]);

      setMemories(memoriesResponse.results || []);
      setFeaturedMemories(featuredResponse);
      setSettings(settingsResponse);
      setNextUrl(memoriesResponse.next);
      setHasMore(!!memoriesResponse.next);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [category, featured]);

  const loadMoreMemories = useCallback(async () => {
    if (!nextUrl || loading) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${nextUrl}`);
      const data = await response.json();

      setMemories(prev => [...prev, ...data.results]);
      setNextUrl(data.next);
      setHasMore(!!data.next);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading]);

  const getMemoryById = useCallback((id: string): Memory | undefined => {
    return memories.find(memory => memory.id === id);
  }, [memories]);

  useEffect(() => {
    refreshMemories();
  }, [refreshMemories]);

  return {
    memories,
    featuredMemories,
    loading,
    error,
    settings,
    refreshMemories,
    getMemoryById,
    loadMoreMemories,
    hasMore
  };
};