import { Suggestion } from '@/types/cockpit';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface SuggestionListProps {
  suggestions: Suggestion[];
  selectedId: string | null;
  onSelect: (suggestion: Suggestion) => void;
  isLoading: boolean;
  hasItem: boolean;
}

export function SuggestionList({ 
  suggestions, 
  selectedId, 
  onSelect, 
  isLoading,
  hasItem 
}: SuggestionListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Sugestões da IA</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Clique para aplicar
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {!hasItem ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-sm text-muted-foreground">
              Selecione um item para ver sugestões
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">
              Buscando sugestões...
            </p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <p className="text-sm text-muted-foreground">
              Nenhuma sugestão encontrada
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => onSelect(suggestion)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring/50",
                  "animate-slide-in-right group",
                  selectedId === suggestion.id
                    ? "bg-primary/10 border border-primary/30 shadow-sm"
                    : "bg-card border border-transparent hover:border-border"
                )}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {suggestion.name}
                  </p>
                  <div className={cn(
                    "shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold",
                    suggestion.similarity >= 90 
                      ? "bg-confidence-high/15 text-confidence-high" 
                      : suggestion.similarity >= 75 
                      ? "bg-confidence-medium/15 text-confidence-medium"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {suggestion.similarity}%
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted">
                    {suggestion.category_name}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="px-2 py-0.5 rounded bg-muted">
                    {suggestion.subcategory_name}
                  </span>
                </div>

                <div className={cn(
                  "mt-2 flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity",
                  "group-hover:opacity-100"
                )}>
                  <span>Clique para aplicar</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
