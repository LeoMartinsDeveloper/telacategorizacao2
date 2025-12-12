import { QueueItem, Suggestion, Category, Subcategory, ProcessPayload } from '@/types/cockpit';

// Base API configuration - update this when integrating with real backend
const API_BASE_URL = '/api';

/**
 * Fetches pending items from the validation queue
 * Endpoint: GET /queue
 */
export async function fetchQueue(): Promise<QueueItem[]> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/queue`);
  // if (!response.ok) throw new Error('Failed to fetch queue');
  // return response.json();
  
  // Return empty array - ready for API integration
  return [];
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
  
  // Return empty array - ready for API integration
  return [];
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
  
  // Return empty array - ready for API integration
  return [];
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
  
  // Return empty array - ready for API integration
  return [];
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
  
  // Simulate success for now
  return;
}

/**
 * Custom error for duplicity conflicts (HTTP 409)
 */
export class DuplicityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicityError';
  }
}

/**
 * Custom error for concurrent modification conflicts
 */
export class ConcurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConcurrencyError';
  }
}
