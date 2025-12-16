import { useState, useEffect } from 'react';
import { QueueItem, Category, Subcategory } from '@/types/cockpit';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, SkipForward, Brain, FileText, Tag } from 'lucide-react';

interface ItemEditorProps {
  item: QueueItem | null;
  categories: Category[];
  subcategories: Subcategory[];
  onSave: (data: { name: string; categoryId: string; subcategoryId: string }) => void;
  onSkip: () => void;
  isSaving?: boolean;
}

export function ItemEditor({
  item,
  categories,
  subcategories,
  onSave,
  onSkip,
  isSaving = false,
}: ItemEditorProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.normalized_name);
      setCategoryId(item.category_id || '');
      setSubcategoryId(item.subcategory_id || '');
    }
  }, [item]);

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === categoryId
  );

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setSubcategoryId('');
  };

  const handleSubmit = () => {
    onSave({ name, categoryId, subcategoryId });
  };

  const canSave = name.trim() && categoryId && subcategoryId;

  // No item selected
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum item selecionado
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Selecione um item da fila à esquerda para começar a validação
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Editor de Item</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              ID: {item.id}
            </p>
          </div>
          <ConfidenceBadge confidence={item.confidence} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
        {/* Original Name */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Tag className="h-3.5 w-3.5" />
            <span>Nome Original</span>
          </div>
          <p className="font-mono text-sm text-foreground">{item.original_name}</p>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nome Normalizado
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Este será o nome oficial do produto no Baseline
          </p>
        </div>

        {/* AI Reasoning */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Raciocínio da IA</Label>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground leading-relaxed">
              {item.reasoning}
            </p>
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Categoria
          </Label>
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Select */}
        <div className="space-y-2">
          <Label htmlFor="subcategory" className="text-sm font-medium">
            Subcategoria
          </Label>
          <Select 
            value={subcategoryId} 
            onValueChange={setSubcategoryId}
            disabled={!categoryId}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder={categoryId ? "Selecione uma subcategoria" : "Selecione uma categoria primeiro"} />
            </SelectTrigger>
            <SelectContent>
              {filteredSubcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CNPJ Info */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">CNPJ do Cliente:</span>{' '}
            <span className="font-mono">{item.cnpj}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1"
            disabled={isSaving}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Pular
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!canSave || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
      </div>
    </div>
  );
}
