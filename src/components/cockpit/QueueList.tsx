import { QueueItem } from '@/types/cockpit';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, CheckCircle, CheckSquare, Square } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface QueueListProps {
  items: QueueItem[];
  selectedId: string | null;
  selectedBatchIds: string[];
  onSelect: (item: QueueItem) => void;
  onToggleBatch: (id: string) => void;
  onSelectAll: () => void;
  onClearBatch: () => void;
}

const getConfidenceIcon = (confidence: number) => {
  if (confidence < 50) return <AlertTriangle className="h-3.5 w-3.5 text-confidence-low" />;
  if (confidence < 75) return <Clock className="h-3.5 w-3.5 text-confidence-medium" />;
  return <CheckCircle className="h-3.5 w-3.5 text-confidence-high" />;
};

const getConfidenceColor = (confidence: number) => {
  if (confidence < 50) return 'bg-confidence-low/10 text-confidence-low border-confidence-low/30';
  if (confidence < 75) return 'bg-confidence-medium/10 text-confidence-medium border-confidence-medium/30';
  return 'bg-confidence-high/10 text-confidence-high border-confidence-high/30';
};

export function QueueList({ 
  items, 
  selectedId, 
  selectedBatchIds, 
  onSelect, 
  onToggleBatch,
  onSelectAll,
  onClearBatch,
}: QueueListProps) {
  const isBatchMode = selectedBatchIds.length > 0;
  const allSelected = items.length > 0 && selectedBatchIds.length === items.length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Fila de Validação</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {items.length} itens pendentes
            </p>
          </div>
        </div>
        
        {/* Batch controls */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={allSelected ? onClearBatch : onSelectAll}
              className="h-7 text-xs gap-1.5"
            >
              {allSelected ? (
                <>
                  <CheckSquare className="h-3.5 w-3.5" />
                  Desmarcar todos
                </>
              ) : (
                <>
                  <Square className="h-3.5 w-3.5" />
                  Selecionar todos
                </>
              )}
            </Button>
            {isBatchMode && (
              <span className="text-xs text-primary font-medium">
                {selectedBatchIds.length} selecionado(s)
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2 space-y-1">
          {items.map((item, index) => {
            const isInBatch = selectedBatchIds.includes(item.id);
            
            return (
              <div
                key={item.id}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50",
                  "animate-fade-in",
                  selectedId === item.id 
                    ? "bg-primary/10 border border-primary/30 shadow-sm" 
                    : isInBatch
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-card border border-transparent"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="pt-0.5">
                    <Checkbox 
                      checked={isInBatch}
                      onCheckedChange={() => onToggleBatch(item.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                    />
                  </div>
                  
                  {/* Item content - clickable */}
                  <button
                    onClick={() => onSelect(item)}
                    className="flex-1 min-w-0 text-left focus:outline-none"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.normalized_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">
                          {item.original_name}
                        </p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0",
                        getConfidenceColor(item.confidence)
                      )}>
                        {getConfidenceIcon(item.confidence)}
                        <span>{item.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="font-mono">{item.cnpj}</span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
