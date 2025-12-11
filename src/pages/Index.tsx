import { useState, useCallback } from 'react';
import { QueueList } from '@/components/cockpit/QueueList';
import { ItemEditor } from '@/components/cockpit/ItemEditor';
import { SuggestionList } from '@/components/cockpit/SuggestionList';
import { 
  mockQueue, 
  mockSuggestions, 
  mockCategories, 
  mockSubcategories 
} from '@/data/mockData';
import { QueueItem, Suggestion } from '@/types/cockpit';
import { useToast } from '@/hooks/use-toast';
import { Cpu, AlertCircle } from 'lucide-react';

const Index = () => {
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSelectItem = useCallback((item: QueueItem) => {
    setSelectedItem(item);
    setSelectedSuggestion(null);
    
    // Simulate lazy loading suggestions
    setIsLoadingSuggestions(true);
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setIsLoadingSuggestions(false);
    }, 800);
  }, []);

  const handleSelectSuggestion = useCallback((suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    toast({
      title: "Sugestão aplicada",
      description: `Categoria e subcategoria preenchidas automaticamente.`,
    });
  }, [toast]);

  const handleSave = useCallback(async (data: { name: string; categoryId: string; subcategoryId: string }) => {
    if (!selectedItem) return;

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random conflict error (10% chance)
    if (Math.random() < 0.1) {
      setIsSaving(false);
      toast({
        variant: "destructive",
        title: "Erro de duplicidade",
        description: "Este nome já existe no cadastro deste cliente. Por favor, verifique ou use outro nome.",
      });
      return;
    }

    // Optimistic update - remove from queue
    const currentIndex = queue.findIndex(item => item.id === selectedItem.id);
    const newQueue = queue.filter(item => item.id !== selectedItem.id);
    setQueue(newQueue);

    // Move to next item
    const nextItem = newQueue[currentIndex] || newQueue[0] || null;
    if (nextItem) {
      handleSelectItem(nextItem);
    } else {
      setSelectedItem(null);
      setSuggestions([]);
    }

    setIsSaving(false);
    toast({
      title: "Item salvo com sucesso",
      description: `"${data.name}" foi classificado e movido para o Baseline.`,
    });
  }, [selectedItem, queue, handleSelectItem, toast]);

  const handleSkip = useCallback(() => {
    if (!selectedItem) return;

    const currentIndex = queue.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    
    if (queue.length > 1 || nextIndex !== currentIndex) {
      handleSelectItem(queue[nextIndex]);
    }

    toast({
      title: "Item pulado",
      description: "Avançando para o próximo item da fila.",
    });
  }, [selectedItem, queue, handleSelectItem, toast]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Cpu className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Cockpit de Validação</h1>
            <p className="text-xs text-muted-foreground">Classificação Manual de Itens</p>
          </div>
        </div>
        
        {queue.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <AlertCircle className="h-3.5 w-3.5 text-confidence-medium" />
            <span className="text-xs font-medium text-muted-foreground">
              {queue.length} pendentes
            </span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Column 1: Queue */}
        <aside className="w-80 border-r border-border bg-card overflow-hidden shrink-0">
          <QueueList
            items={queue}
            selectedId={selectedItem?.id || null}
            onSelect={handleSelectItem}
          />
        </aside>

        {/* Column 2: Editor */}
        <section className="flex-1 min-w-0 bg-background overflow-hidden">
          <ItemEditor
            item={selectedItem}
            categories={mockCategories}
            subcategories={mockSubcategories}
            selectedSuggestion={selectedSuggestion}
            onSave={handleSave}
            onSkip={handleSkip}
            isSaving={isSaving}
          />
        </section>

        {/* Column 3: Suggestions */}
        <aside className="w-80 border-l border-border bg-card overflow-hidden shrink-0">
          <SuggestionList
            suggestions={suggestions}
            selectedId={selectedSuggestion?.id || null}
            onSelect={handleSelectSuggestion}
            isLoading={isLoadingSuggestions}
            hasItem={!!selectedItem}
          />
        </aside>
      </main>
    </div>
  );
};

export default Index;
