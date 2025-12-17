import { useState } from 'react';
import { StagingItem } from '@/types/cockpit';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Undo2, Send, Package, Loader2 } from 'lucide-react';

interface StagingPanelProps {
  items: StagingItem[];
  onRevert: (item: StagingItem) => void;
  onCommit: () => void;
  isCommitting: boolean;
}

export function StagingPanel({ items, onRevert, onCommit, isCommitting }: StagingPanelProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  const handleRevertSelected = () => {
    const itemsToRevert = items.filter(item => selectedIds.has(item.id));
    itemsToRevert.forEach(item => onRevert(item));
    setSelectedIds(new Set());
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Carrinho de Envio</h3>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="text-sm font-medium text-foreground mb-2">Carrinho vazio</h4>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Classifique itens no editor e clique em "Salvar" para adicioná-los ao carrinho
          </p>
        </div>
      </div>
    );
  }

  const allSelected = selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Carrinho de Envio</h3>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
        
        {/* Select All + Revert Selected */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleSelectAll}
              className="cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">
              {someSelected ? `${selectedIds.size} selecionado(s)` : 'Selecionar todos'}
            </span>
          </div>
          {someSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRevertSelected}
              className="h-7 text-xs gap-1"
            >
              <Undo2 className="h-3 w-3" />
              Voltar ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={() => toggleSelection(item.id)}
                  className="cursor-pointer mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.staged_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        Original: {item.original_name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => onRevert(item)}
                      title="Voltar para a fila"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground truncate">
                      {item.staged_category_name}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary truncate">
                      {item.staged_subcategory_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card">
        <Button
          className="w-full"
          onClick={onCommit}
          disabled={isCommitting}
        >
          {isCommitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Lote ({items.length} {items.length === 1 ? 'item' : 'itens'})
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
