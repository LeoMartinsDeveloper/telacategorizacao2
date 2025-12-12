import { useState, useEffect, useCallback } from 'react';
import { QueueItem, Suggestion, Category, Subcategory } from '@/types/cockpit';
import {
  fetchQueue,
  fetchSuggestions,
  fetchCategories,
  fetchSubcategories,
  processItem,
  DuplicityError,
} from '@/services/cockpitApi';

interface UseCockpitDataReturn {
  // Queue state
  queue: QueueItem[];
  isLoadingQueue: boolean;
  queueError: string | null;
  refetchQueue: () => Promise<void>;

  // Selected item state
  selectedItem: QueueItem | null;
  selectItem: (item: QueueItem) => void;
  clearSelection: () => void;

  // Suggestions state
  suggestions: Suggestion[];
  isLoadingSuggestions: boolean;

  // Categories state
  categories: Category[];
  subcategories: Subcategory[];
  isLoadingCategories: boolean;

  // Actions
  saveItem: (data: { name: string; categoryId: string; subcategoryId: string }) => Promise<{ success: boolean; error?: string }>;
  skipItem: () => void;
  isSaving: boolean;
}

export function useCockpitData(): UseCockpitDataReturn {
  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  // Selected item state
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Action state
  const [isSaving, setIsSaving] = useState(false);

  // Fetch queue on mount
  const loadQueue = useCallback(async () => {
    setIsLoadingQueue(true);
    setQueueError(null);
    try {
      const data = await fetchQueue();
      setQueue(data);
    } catch (error) {
      setQueueError('Erro ao carregar a fila. Tente novamente.');
      console.error('Failed to fetch queue:', error);
    } finally {
      setIsLoadingQueue(false);
    }
  }, []);

  // Fetch categories on mount
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const [cats, subcats] = await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
      ]);
      setCategories(cats);
      setSubcategories(subcats);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    loadQueue();
    loadCategories();
  }, [loadQueue, loadCategories]);

  // Select item and load suggestions
  const selectItem = useCallback(async (item: QueueItem) => {
    setSelectedItem(item);
    setSuggestions([]);
    setIsLoadingSuggestions(true);

    try {
      const data = await fetchSuggestions(item.id);
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    setSuggestions([]);
  }, []);

  // Save item with optimistic update
  const saveItem = useCallback(async (data: { name: string; categoryId: string; subcategoryId: string }) => {
    if (!selectedItem) {
      return { success: false, error: 'Nenhum item selecionado.' };
    }

    setIsSaving(true);

    try {
      await processItem({
        id: selectedItem.id, // Preserve original ID - never generate new
        name: data.name,
        category_id: data.categoryId,
        subcategory_id: data.subcategoryId,
      });

      // Optimistic update - remove from queue
      const currentIndex = queue.findIndex(item => item.id === selectedItem.id);
      const newQueue = queue.filter(item => item.id !== selectedItem.id);
      setQueue(newQueue);

      // Move to next item
      const nextItem = newQueue[currentIndex] || newQueue[0] || null;
      if (nextItem) {
        selectItem(nextItem);
      } else {
        clearSelection();
      }

      return { success: true };
    } catch (error) {
      if (error instanceof DuplicityError) {
        return { 
          success: false, 
          error: 'Este nome já existe no cadastro deste cliente. Por favor, verifique ou use outro nome.' 
        };
      }
      return { success: false, error: 'Erro ao salvar. Tente novamente.' };
    } finally {
      setIsSaving(false);
    }
  }, [selectedItem, queue, selectItem, clearSelection]);

  // Skip to next item without saving
  const skipItem = useCallback(() => {
    if (!selectedItem || queue.length === 0) return;

    const currentIndex = queue.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % queue.length;

    if (queue.length > 1 || nextIndex !== currentIndex) {
      selectItem(queue[nextIndex]);
    }
  }, [selectedItem, queue, selectItem]);

  return {
    queue,
    isLoadingQueue,
    queueError,
    refetchQueue: loadQueue,
    selectedItem,
    selectItem,
    clearSelection,
    suggestions,
    isLoadingSuggestions,
    categories,
    subcategories,
    isLoadingCategories,
    saveItem,
    skipItem,
    isSaving,
  };
}
