import { QueueItem, Suggestion, Category, Subcategory, ProcessPayload, BatchProcessPayload } from '@/types/cockpit';

// Base API configuration - update this when integrating with real backend
const API_BASE_URL = '/api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for development
const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Alimentos' },
  { id: 'cat-2', name: 'Bebidas' },
  { id: 'cat-3', name: 'Limpeza' },
  { id: 'cat-4', name: 'Higiene Pessoal' },
];

const mockSubcategories: Subcategory[] = [
  { id: 'sub-1', name: 'Grãos e Cereais', category_id: 'cat-1' },
  { id: 'sub-2', name: 'Laticínios', category_id: 'cat-1' },
  { id: 'sub-3', name: 'Carnes', category_id: 'cat-1' },
  { id: 'sub-4', name: 'Refrigerantes', category_id: 'cat-2' },
  { id: 'sub-5', name: 'Sucos', category_id: 'cat-2' },
  { id: 'sub-6', name: 'Águas', category_id: 'cat-2' },
  { id: 'sub-7', name: 'Detergentes', category_id: 'cat-3' },
  { id: 'sub-8', name: 'Desinfetantes', category_id: 'cat-3' },
  { id: 'sub-9', name: 'Sabonetes', category_id: 'cat-4' },
  { id: 'sub-10', name: 'Shampoos', category_id: 'cat-4' },
];

const mockQueue: QueueItem[] = [
  {
    id: 'item-1',
    normalized_name: 'Arroz Branco Tipo 1 5kg',
    original_name: 'ARROZ BCO TP1 5KG',
    confidence: 0.92,
    reasoning: 'Alta similaridade com padrão de nomenclatura de arroz. Identificado tipo 1 e peso 5kg.',
    cnpj: '12.345.678/0001-90',
    created_at: new Date().toISOString(),
    category_id: 'cat-1',
    subcategory_id: 'sub-1',
  },
  {
    id: 'item-2',
    normalized_name: 'Refrigerante Cola 2L',
    original_name: 'REFRI COLA 2LT',
    confidence: 0.78,
    reasoning: 'Provável refrigerante de cola. Confiança média devido à abreviação não padronizada.',
    cnpj: '12.345.678/0001-90',
    created_at: new Date().toISOString(),
    category_id: 'cat-2',
    subcategory_id: 'sub-4',
  },
  {
    id: 'item-3',
    normalized_name: 'Detergente Líquido Neutro 500ml',
    original_name: 'DET LIQ NEUTRO 500',
    confidence: 0.45,
    reasoning: 'Baixa confiança. Pode ser detergente de louça ou de roupa. Necessita validação manual.',
    cnpj: '98.765.432/0001-10',
    created_at: new Date().toISOString(),
  },
  {
    id: 'item-4',
    normalized_name: 'Leite Integral UHT 1L',
    original_name: 'LT INTEG UHT 1L',
    confidence: 0.88,
    reasoning: 'Padrão de leite UHT identificado com alta confiança.',
    cnpj: '12.345.678/0001-90',
    created_at: new Date().toISOString(),
    category_id: 'cat-1',
    subcategory_id: 'sub-2',
  },
  {
    id: 'item-5',
    normalized_name: 'Sabonete Líquido Antibacteriano 250ml',
    original_name: 'SAB LIQ ANTIBAC 250ML',
    confidence: 0.65,
    reasoning: 'Identificado como sabonete líquido. Confiança média no atributo antibacteriano.',
    cnpj: '55.444.333/0001-22',
    created_at: new Date().toISOString(),
    category_id: 'cat-4',
    subcategory_id: 'sub-9',
  },
];

const mockSuggestions: Record<string, Suggestion[]> = {
  'item-1': [
    { id: 'sug-1', name: 'Arroz Branco Tipo 1 Camil 5kg', category_id: 'cat-1', category_name: 'Alimentos', subcategory_id: 'sub-1', subcategory_name: 'Grãos e Cereais', similarity: 0.95 },
    { id: 'sug-2', name: 'Arroz Branco Tipo 1 Tio João 5kg', category_id: 'cat-1', category_name: 'Alimentos', subcategory_id: 'sub-1', subcategory_name: 'Grãos e Cereais', similarity: 0.93 },
  ],
  'item-2': [
    { id: 'sug-3', name: 'Coca-Cola 2L', category_id: 'cat-2', category_name: 'Bebidas', subcategory_id: 'sub-4', subcategory_name: 'Refrigerantes', similarity: 0.88 },
    { id: 'sug-4', name: 'Pepsi 2L', category_id: 'cat-2', category_name: 'Bebidas', subcategory_id: 'sub-4', subcategory_name: 'Refrigerantes', similarity: 0.85 },
  ],
  'item-3': [
    { id: 'sug-5', name: 'Detergente Ypê Neutro 500ml', category_id: 'cat-3', category_name: 'Limpeza', subcategory_id: 'sub-7', subcategory_name: 'Detergentes', similarity: 0.72 },
    { id: 'sug-6', name: 'Detergente Limpol Neutro 500ml', category_id: 'cat-3', category_name: 'Limpeza', subcategory_id: 'sub-7', subcategory_name: 'Detergentes', similarity: 0.70 },
  ],
  'item-4': [
    { id: 'sug-7', name: 'Leite Integral Parmalat 1L', category_id: 'cat-1', category_name: 'Alimentos', subcategory_id: 'sub-2', subcategory_name: 'Laticínios', similarity: 0.91 },
    { id: 'sug-8', name: 'Leite Integral Italac 1L', category_id: 'cat-1', category_name: 'Alimentos', subcategory_id: 'sub-2', subcategory_name: 'Laticínios', similarity: 0.89 },
  ],
  'item-5': [
    { id: 'sug-9', name: 'Sabonete Líquido Protex 250ml', category_id: 'cat-4', category_name: 'Higiene Pessoal', subcategory_id: 'sub-9', subcategory_name: 'Sabonetes', similarity: 0.82 },
  ],
};

/**
 * Fetches pending items from the validation queue
 * Endpoint: GET /queue
 */
export async function fetchQueue(): Promise<QueueItem[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/queue`);
  // if (!response.ok) throw new Error('Failed to fetch queue');
  // return response.json();
  
  await delay(500);
  return mockQueue;
}

/**
 * Fetches similar item suggestions for a given item
 * Endpoint: GET /suggestions?item_id={id}
 */
export async function fetchSuggestions(itemId: string): Promise<Suggestion[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/suggestions?item_id=${itemId}`);
  // if (!response.ok) throw new Error('Failed to fetch suggestions');
  // return response.json();
  
  await delay(300);
  return mockSuggestions[itemId] || [];
}

/**
 * Fetches available categories
 * Endpoint: GET /categories
 */
export async function fetchCategories(): Promise<Category[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/categories`);
  // if (!response.ok) throw new Error('Failed to fetch categories');
  // return response.json();
  
  await delay(200);
  return mockCategories;
}

/**
 * Fetches subcategories, optionally filtered by category
 * Endpoint: GET /subcategories?category_id={id}
 */
export async function fetchSubcategories(categoryId?: string): Promise<Subcategory[]> {
  // TODO: Replace with actual API call
  // const url = categoryId 
  //   ? `${API_BASE_URL}/subcategories?category_id=${categoryId}`
  //   : `${API_BASE_URL}/subcategories`;
  // const response = await fetch(url);
  // if (!response.ok) throw new Error('Failed to fetch subcategories');
  // return response.json();
  
  await delay(200);
  if (categoryId) {
    return mockSubcategories.filter(sub => sub.category_id === categoryId);
  }
  return mockSubcategories;
}

/**
 * Processes (saves) a validated item
 * Endpoint: POST /process
 * 
 * @throws {DuplicityError} When item name already exists for the same CNPJ
 */
export async function processItem(payload: ProcessPayload): Promise<void> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/process`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // 
  // if (response.status === 409) {
  //   throw new DuplicityError('Este nome já existe no cadastro deste cliente.');
  // }
  // 
  // if (!response.ok) {
  //   throw new Error('Failed to process item');
  // }
  
  await delay(400);
  console.log('Item processed:', payload);
}

/**
 * Processes multiple items in batch
 * Endpoint: POST /process-batch
 */
export async function processBatch(payload: BatchProcessPayload): Promise<void> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/process-batch`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('Failed to process batch');
  // }
  
  await delay(600);
  console.log('Batch processed:', payload);
}

/**
 * Custom error for duplicity conflicts (HTTP 409)
 */
export class DuplicityError extends Error {
  constructor(message: string = 'Este nome já existe no cadastro deste cliente.') {
    super(message);
    this.name = 'DuplicityError';
  }
}

/**
 * Custom error for concurrent modification conflicts
 */
export class ConcurrencyError extends Error {
  constructor(message: string = 'Este item foi modificado por outro usuário.') {
    super(message);
    this.name = 'ConcurrencyError';
  }
}
