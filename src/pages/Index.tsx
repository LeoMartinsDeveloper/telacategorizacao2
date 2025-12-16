import { useCallback } from 'react';
import { QueueList } from '@/components/cockpit/QueueList';
import { ItemEditor } from '@/components/cockpit/ItemEditor';
import { StagingPanel } from '@/components/cockpit/StagingPanel';
import { useCockpitData } from '@/hooks/useCockpitData';
import { StagingItem } from '@/types/cockpit';
import { useToast } from '@/hooks/use-toast';
import { Cpu, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { toast } = useToast();
  const {
    queue,
    isLoadingQueue,
    queueError,
    refetchQueue,
    selectedItem,
    selectItem,
    selectedBatchIds,
    toggleBatchSelection,
    selectAllBatch,
    clearBatchSelection,
    stagingArea,
    addToStaging,
    revertFromStaging,
    commitBatch,
    isCommitting,
    categories,
    subcategories,
    skipItem,
  } = useCockpitData();

  const handleSelectItem = useCallback((item: typeof selectedItem) => {
    if (item) {
      selectItem(item);
    }
  }, [selectItem]);

  const handleSave = useCallback((data: { name: string; categoryId: string; subcategoryId: string }) => {
    addToStaging(data);
    toast({
      title: "Item adicionado ao carrinho",
      description: `"${data.name}" está pronto para envio.`,
    });
  }, [addToStaging, toast]);

  const handleRevert = useCallback((item: StagingItem) => {
    revertFromStaging(item);
    toast({
      title: "Item devolvido à fila",
      description: `"${item.staged_name}" voltou para a fila de pendentes.`,
    });
  }, [revertFromStaging, toast]);

  const handleCommit = useCallback(async () => {
    const result = await commitBatch();

    if (result.success) {
      toast({
        title: "Lote enviado com sucesso",
        description: `${result.count} itens foram salvos no Baseline.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao enviar lote",
        description: result.error,
      });
    }
  }, [commitBatch, toast]);

  const handleSkip = useCallback(() => {
    skipItem();
    toast({
      title: "Item pulado",
      description: "Avançando para o próximo item da fila.",
    });
  }, [skipItem, toast]);

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
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={refetchQueue}
            disabled={isLoadingQueue}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingQueue ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          {queue.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              <AlertCircle className="h-3.5 w-3.5 text-confidence-medium" />
              <span className="text-xs font-medium text-muted-foreground">
                {queue.length} pendentes
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Column 1: Queue */}
        <aside className="w-80 border-r border-border bg-card overflow-hidden shrink-0">
          {isLoadingQueue ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Carregando fila...</p>
            </div>
          ) : queueError ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{queueError}</p>
              <Button variant="outline" size="sm" onClick={refetchQueue}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            
            <QueueList
              items={queue}
              selectedId={selectedItem?.id || null}
              selectedBatchIds={selectedBatchIds}
              onSelect={handleSelectItem}
              onToggleBatch={toggleBatchSelection}
              onSelectAll={selectAllBatch}
              onClearBatch={clearBatchSelection}
            />
          )}
        </aside>

        {/* Column 2: Editor */}
        <section className="flex-1 min-w-0 bg-background overflow-hidden">
          <ItemEditor
            item={selectedItem}
            categories={categories}
            subcategories={subcategories}
            onSave={handleSave}
            onSkip={handleSkip}
          />
        </section>

        {/* Column 3: Staging Panel */}
        <aside className="w-80 border-l border-border bg-card overflow-hidden shrink-0">
          <StagingPanel
            items={stagingArea}
            onRevert={handleRevert}
            onCommit={handleCommit}
            isCommitting={isCommitting}
          />
        </aside>
      </main>
    </div>
  );
};

export default Index;
