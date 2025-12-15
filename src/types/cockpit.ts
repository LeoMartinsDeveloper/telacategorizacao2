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

export interface Suggestion {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
  similarity: number;
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
    category_id: string;
    subcategory_id: string;
  }[];
}
