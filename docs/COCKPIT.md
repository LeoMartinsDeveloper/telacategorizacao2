# Cockpit de Validação - Documentação

## Índice

1. [Visão Geral](#visão-geral)
2. [Interface do Usuário](#interface-do-usuário)
3. [Guia de Uso](#guia-de-uso)
4. [Processamento em Lote](#processamento-em-lote)
5. [Integração de API](#integração-de-api)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Regras de Negócio](#regras-de-negócio)

---

## Visão Geral

O **Cockpit de Validação** é uma interface desenvolvida para operadores validarem e classificarem itens que a IA não teve confiança suficiente para processar automaticamente. 

### Premissas Fundamentais

- A **persistência e consistência dos dados** são garantidas pelo Banco de Dados
- O backend atua como um **proxy para as Stored Functions**
- O **ID do item é imutável** e deve ser preservado da tabela de origem para a tabela de destino

---

## Interface do Usuário

A tela é dividida em **3 colunas**:

```
┌─────────────────┬─────────────────────────────┬─────────────────┐
│                 │                             │                 │
│   📋 FILA       │       ✏️ EDITOR             │   💡 SUGESTÕES  │
│   (Esquerda)    │       (Centro)              │   (Direita)     │
│                 │                             │                 │
│  Lista de       │  Edição do item             │  Sugestões da   │
│  itens          │  selecionado                │  IA             │
│  pendentes      │                             │                 │
│                 │                             │                 │
└─────────────────┴─────────────────────────────┴─────────────────┘
```

### Coluna 1: Fila (Esquerda)

Lista todos os itens pendentes de validação.

| Elemento | Descrição |
|----------|-----------|
| **Nome Normalizado** | Nome sugerido pela IA |
| **Nome Original** | Nome original do produto |
| **CNPJ** | Identificador do cliente |
| **Badge de Confiança** | Indicador visual do nível de confiança |

**Cores do Badge de Confiança:**
- 🔴 **Vermelho**: Confiança < 50%
- 🟡 **Amarelo**: Confiança entre 50% e 75%
- 🟢 **Verde**: Confiança > 75%

### Coluna 2: Editor (Centro)

Área principal para edição e classificação do item.

| Elemento | Descrição |
|----------|-----------|
| **Nome Original** | Exibição do nome original (somente leitura) |
| **Nome Normalizado** | Campo editável - será o nome oficial do produto |
| **Raciocínio da IA** | Explicação da IA sobre a classificação (somente leitura) |
| **Categoria** | Dropdown para seleção da categoria |
| **Subcategoria** | Dropdown para seleção da subcategoria (filtrado pela categoria) |
| **CNPJ do Cliente** | Identificador do cliente (somente leitura) |
| **Botão Salvar** | Envia o item para processamento |
| **Botão Pular** | Avança para o próximo item sem salvar |

### Coluna 3: Sugestões (Direita)

Exibe itens similares encontrados pela IA.

| Elemento | Descrição |
|----------|-----------|
| **Nome da Sugestão** | Nome do item similar |
| **% Similaridade** | Porcentagem de similaridade com o item atual |
| **Categoria/Subcategoria** | Classificação do item sugerido |

**Interação:** Ao clicar em uma sugestão, a categoria e subcategoria são preenchidas automaticamente no editor.

---

## Guia de Uso

### Fluxo de Trabalho Básico

```
1. Selecionar item na fila
        ↓
2. Revisar informações e raciocínio da IA
        ↓
3. (Opcional) Clicar em sugestão para preencher categoria
        ↓
4. Editar nome se necessário
        ↓
5. Selecionar categoria e subcategoria
        ↓
6. Clicar em "Salvar" ou "Pular"
```

### Ações Disponíveis

#### Salvar Item
- Valida e envia o item para o Baseline
- Remove o item da fila automaticamente
- Carrega o próximo item

#### Pular Item
- Avança para o próximo item
- **Não faz requisição** ao backend
- O item permanece na fila para revisão posterior

#### Atualizar Fila
- Recarrega a lista de itens pendentes
- Útil quando outros operadores estão trabalhando simultaneamente

---

## Processamento em Lote

O Cockpit suporta **processamento em lote (batch)**, permitindo classificar múltiplos itens com a mesma categoria/subcategoria de uma só vez.

### Ativando o Modo Lote

1. Na coluna da **Fila**, marque os checkboxes dos itens que deseja processar
2. Use "Selecionar todos" para marcar todos os itens
3. O **Editor** mudará automaticamente para o modo lote

### Interface do Modo Lote

Quando em modo lote, o Editor exibe:

| Elemento | Descrição |
|----------|-----------|
| **Contador** | Quantidade de itens selecionados |
| **Categoria** | Dropdown para selecionar categoria (aplicada a todos) |
| **Subcategoria** | Dropdown para selecionar subcategoria (aplicada a todos) |
| **Botão Salvar** | Processa todos os itens selecionados |

> ⚠️ **Importante:** No modo lote, os **nomes dos itens são mantidos inalterados**. Apenas categoria e subcategoria são aplicadas.

### Fluxo de Trabalho em Lote

#### Opção 1: Via Editor (Coluna 2)

```
1. Marcar checkboxes dos itens similares
         ↓
2. Editor muda para "Modo Lote"
         ↓
3. Selecionar categoria comum
         ↓
4. Selecionar subcategoria comum
         ↓
5. Clicar em "Salvar X itens"
         ↓
6. Itens removidos da fila (transição otimista)
```

#### Opção 2: Via Sugestões (Coluna 3) - Recomendado

```
1. Marcar checkboxes dos itens similares
         ↓
2. Coluna de Sugestões exibe botões "Aplicar em X itens"
         ↓
3. Clicar no botão da sugestão desejada
         ↓
4. Categoria/Subcategoria aplicadas automaticamente a todos
         ↓
5. Itens removidos da fila (transição otimista)
```

> 💡 **Dica:** A Opção 2 é mais rápida pois aplica diretamente a classificação da sugestão sem necessidade de seleção manual.

### Tipos TypeScript para Lote

```typescript
// Payload para processamento em lote
interface BatchProcessPayload {
  items: {
    id: string;           // ID original do item - IMUTÁVEL
    category_id: string;
    subcategory_id: string;
  }[];
}
```

---

## Integração de API

### Arquivos Principais

```
src/
├── services/
│   └── cockpitApi.ts      # Funções de comunicação com a API
├── hooks/
│   └── useCockpitData.ts  # Hook de gerenciamento de estado
└── types/
    └── cockpit.ts         # Definições de tipos TypeScript
```

### Configuração Base

Edite o arquivo `src/services/cockpitApi.ts` e atualize a URL base:

```typescript
const API_BASE_URL = 'https://sua-api.com/api';
```

### Endpoints Necessários

#### 1. GET /queue

Retorna a lista de itens pendentes de validação.

**Response:**
```typescript
interface QueueItem {
  id: string;              // UUID - IMUTÁVEL
  normalized_name: string; // Nome sugerido pela IA
  original_name: string;   // Nome original do produto
  confidence: number;      // 0-100
  reasoning: string;       // Explicação da IA
  cnpj: string;            // CNPJ do cliente
  created_at: string;      // ISO 8601
  category_id?: string;    // Categoria pré-selecionada (opcional)
  subcategory_id?: string; // Subcategoria pré-selecionada (opcional)
}

// Response: QueueItem[]
```

**Exemplo de implementação:**
```typescript
export async function fetchQueue(): Promise<QueueItem[]> {
  const response = await fetch(`${API_BASE_URL}/queue`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch queue');
  }
  
  return response.json();
}
```

---

#### 2. GET /suggestions

Retorna sugestões de itens similares.

**Query Parameters:**
- `item_id` (required): ID do item selecionado

**Response:**
```typescript
interface Suggestion {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
  similarity: number;      // 0-100
}

// Response: Suggestion[]
```

**Exemplo de implementação:**
```typescript
export async function fetchSuggestions(itemId: string): Promise<Suggestion[]> {
  const response = await fetch(
    `${API_BASE_URL}/suggestions?item_id=${encodeURIComponent(itemId)}`,
    {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  
  return response.json();
}
```

---

#### 3. GET /categories

Retorna a lista de categorias disponíveis.

**Response:**
```typescript
interface Category {
  id: string;
  name: string;
}

// Response: Category[]
```

---

#### 4. GET /subcategories

Retorna a lista de subcategorias.

**Query Parameters:**
- `category_id` (optional): Filtra por categoria

**Response:**
```typescript
interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

// Response: Subcategory[]
```

---

#### 5. POST /process

Processa e salva um item validado.

**Request Body:**
```typescript
interface ProcessPayload {
  id: string;           // UUID original - NUNCA GERAR NOVO
  name: string;         // Nome normalizado (editado ou não)
  category_id: string;
  subcategory_id: string;
}
```

**Responses:**

| Status | Descrição |
|--------|-----------|
| 200 OK | Item processado com sucesso |
| 409 Conflict | Nome duplicado para o mesmo CNPJ |
| 404 Not Found | Item não encontrado (possível concorrência) |
| 400 Bad Request | Dados inválidos |

**Exemplo de implementação:**
```typescript
export async function processItem(payload: ProcessPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    throw new DuplicityError('Nome já existe para este cliente.');
  }

  if (response.status === 404) {
    throw new ConcurrencyError('Item já foi processado por outro operador.');
  }

  if (!response.ok) {
    throw new Error('Failed to process item');
  }
}
```

---

#### 6. POST /process-batch

Processa múltiplos itens em lote.

**Request Body:**
```typescript
interface BatchProcessPayload {
  items: {
    id: string;           // UUID original - NUNCA GERAR NOVO
    category_id: string;
    subcategory_id: string;
  }[];
}
```

**Responses:**

| Status | Descrição |
|--------|-----------|
| 200 OK | Lote processado com sucesso |
| 400 Bad Request | Dados inválidos |
| 500 Internal Error | Erro no processamento do lote |

**Exemplo de implementação:**
```typescript
export async function processBatch(payload: BatchProcessPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/process-batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to process batch');
  }
}
```

---

Substitua o conteúdo de `src/services/cockpitApi.ts`:

```typescript
import { QueueItem, Suggestion, Category, Subcategory, ProcessPayload } from '@/types/cockpit';

const API_BASE_URL = 'https://sua-api.com/api';

// Função auxiliar para obter token de autenticação
function getAuthToken(): string {
  return localStorage.getItem('auth_token') || '';
}

// Função auxiliar para requisições
async function apiRequest<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new DuplicityError('Conflito de duplicidade');
    }
    if (response.status === 404) {
      throw new ConcurrencyError('Recurso não encontrado');
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function fetchQueue(): Promise<QueueItem[]> {
  return apiRequest<QueueItem[]>('/queue');
}

export async function fetchSuggestions(itemId: string): Promise<Suggestion[]> {
  return apiRequest<Suggestion[]>(`/suggestions?item_id=${encodeURIComponent(itemId)}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/categories');
}

export async function fetchSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const query = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : '';
  return apiRequest<Subcategory[]>(`/subcategories${query}`);
}

export async function processItem(payload: ProcessPayload): Promise<void> {
  await apiRequest<void>('/process', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export class DuplicityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicityError';
  }
}

export class ConcurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConcurrencyError';
  }
}
```

---

## Tratamento de Erros

### Erro 409 - Duplicidade

**Causa:** Tentativa de salvar um item com nome que já existe para o mesmo CNPJ.

**Mensagem exibida:**
> "Este nome já existe no cadastro deste cliente. Por favor, verifique ou use outro nome."

**Ação do usuário:** Editar o nome e tentar salvar novamente.

---

### Erro 404 - Concorrência

**Causa:** Outro operador já processou o mesmo item.

**Mensagem exibida:**
> "Este item já foi processado por outro operador. Atualize a fila."

**Ação do usuário:** Clicar em "Atualizar" para recarregar a fila.

---

### Erro de Conexão

**Causa:** Falha na comunicação com o servidor.

**Mensagem exibida:**
> "Erro de conexão. Verifique sua internet e tente novamente."

---

## Regras de Negócio

### Imutabilidade do ID

```
⚠️ CRÍTICO: O ID do item NUNCA deve ser alterado ou regenerado.

Fluxo correto:
tb_manual_classification (ID: X)
        ↓
   POST /process
        ↓
tb_item_baseline (ID: X) ← MESMO ID
tb_manual_classification_audit (ID: X) ← MESMO ID
```

### Edição de Nome

- O operador pode editar o `normalized_name`
- O novo nome será o nome oficial no Baseline
- **Restrição:** Não pode haver dois itens com o mesmo nome para o mesmo CNPJ

### Concorrência

- O sistema usa `FOR UPDATE` nas queries para evitar conflitos
- Se dois operadores tentarem salvar o mesmo item, o segundo receberá erro
- O frontend deve solicitar atualização da fila em caso de erro

### Transição Otimista

Após salvar com sucesso:
1. O item é removido da lista local imediatamente
2. O próximo item é carregado automaticamente
3. Não é necessário recarregar a fila inteira

---

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
