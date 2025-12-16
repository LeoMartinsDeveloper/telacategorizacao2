export interface QueueItem {
  id: string;
  normalized_name: string;
  original_name: string;
  confidence: number;
  reasoning: string;
  cnpj: string;
  created_at: string;
  category_id?: string;
  subcategory_id?: string;
}

export interface StagingItem extends QueueItem {
  staged_category_id: string;
  staged_category_name: string;
  staged_subcategory_id: string;
  staged_subcategory_name: string;
  staged_name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export interface ProcessPayload {
  id: string;
  name: string;
  category_id: string;
  subcategory_id: string;
}

export interface BatchProcessPayload {
  items: {
    id: string;
    name: string;
    category_id: string;
    subcategory_id: string;
  }[];
}
