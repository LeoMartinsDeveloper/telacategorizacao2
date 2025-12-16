import { useState, useEffect, useCallback } from 'react';
import { QueueItem, StagingItem, Category, Subcategory } from '@/types/cockpit';
import {
  fetchQueue,
  fetchCategories,
  fetchSubcategories,
  processBatch,
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

  // Staging area state
  stagingArea: StagingItem[];
  addToStaging: (data: { name: string; categoryId: string; subcategoryId: string }) => void;
  revertFromStaging: (item: StagingItem) => void;
  commitBatch: () => Promise<{ success: boolean; error?: string; count?: number }>;
  isCommitting: boolean;

  // Categories state
  categories: Category[];
  subcategories: Subcategory[];
  isLoadingCategories: boolean;

  // Actions
  skipItem: () => void;
}

export function useCockpitData(): UseCockpitDataReturn {
  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  // Selected item state
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);

  // Staging area state
  const [stagingArea, setStagingArea] = useState<StagingItem[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch queue on mount
  const loadQueue = useCallback(async () => {
    setIsLoadingQueue(true);
    setQueueError(null);
    try {
      const data = await fetchQueue();
      setQueue(data);
      // Auto-select first item
      if (data.length > 0) {
        setSelectedItem(data[0]);
      }
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

  // Select item
  const selectItem = useCallback((item: QueueItem) => {
    setSelectedItem(item);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Add item to staging (move from queue to staging)
  const addToStaging = useCallback((data: { name: string; categoryId: string; subcategoryId: string }) => {
    if (!selectedItem) return;

    const category = categories.find(c => c.id === data.categoryId);
    const subcategory = subcategories.find(s => s.id === data.subcategoryId);

    const stagingItem: StagingItem = {
      ...selectedItem,
      staged_name: data.name,
      staged_category_id: data.categoryId,
      staged_category_name: category?.name || '',
      staged_subcategory_id: data.subcategoryId,
      staged_subcategory_name: subcategory?.name || '',
    };

    // Add to staging
    setStagingArea(prev => [...prev, stagingItem]);

    // Remove from queue (optimistic)
    const currentIndex = queue.findIndex(item => item.id === selectedItem.id);
    const newQueue = queue.filter(item => item.id !== selectedItem.id);
    setQueue(newQueue);

    // Move to next item
    const nextItem = newQueue[currentIndex] || newQueue[0] || null;
    setSelectedItem(nextItem);
  }, [selectedItem, queue, categories, subcategories]);

  // Revert item from staging back to queue
  const revertFromStaging = useCallback((item: StagingItem) => {
    // Remove staged fields and add back to queue
    const { staged_name, staged_category_id, staged_category_name, staged_subcategory_id, staged_subcategory_name, ...queueItem } = item;
    
    // Add back to queue
    setQueue(prev => [...prev, queueItem as QueueItem]);

    // Remove from staging
    setStagingArea(prev => prev.filter(i => i.id !== item.id));

    // If no item selected, select the reverted item
    if (!selectedItem) {
      setSelectedItem(queueItem as QueueItem);
    }
  }, [selectedItem]);

  // Commit batch to API
  const commitBatch = useCallback(async () => {
    if (stagingArea.length === 0) {
      return { success: false, error: 'Nenhum item no carrinho.' };
    }

    setIsCommitting(true);

    try {
      const payload = {
        items: stagingArea.map(item => ({
          id: item.id,
          name: item.staged_name,
          category_id: item.staged_category_id,
          subcategory_id: item.staged_subcategory_id,
        })),
      };

      await processBatch(payload);

      const count = stagingArea.length;
      
      // Clear staging area on success
      setStagingArea([]);

      return { success: true, count };
    } catch (error) {
      if (error instanceof DuplicityError) {
        return { 
          success: false, 
          error: 'Alguns itens possuem nomes duplicados. Verifique e tente novamente.' 
        };
      }
      return { success: false, error: 'Erro ao enviar lote. Tente novamente.' };
    } finally {
      setIsCommitting(false);
    }
  }, [stagingArea]);

  // Skip to next item without saving
  const skipItem = useCallback(() => {
    if (!selectedItem || queue.length === 0) return;

    const currentIndex = queue.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % queue.length;

    if (queue.length > 1 || nextIndex !== currentIndex) {
      setSelectedItem(queue[nextIndex]);
    }
  }, [selectedItem, queue]);

  return {
    queue,
    isLoadingQueue,
    queueError,
    refetchQueue: loadQueue,
    selectedItem,
    selectItem,
    clearSelection,
    stagingArea,
    addToStaging,
    revertFromStaging,
    commitBatch,
    isCommitting,
    categories,
    subcategories,
    isLoadingCategories,
    skipItem,
  };
}
