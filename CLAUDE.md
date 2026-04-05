Padrões de Código — Frontend
Este arquivo define os padrões obrigatórios para revisão, geração e refatoração de código neste projeto. Ao revisar ou gerar código, aplique todas as regras abaixo sem exceção.
---
Stack e Versões
Biblioteca	Versão	Uso
React	19.x	Framework principal
TypeScript	~5.8	Tipagem estática
Vite	7.x	Build tool
Tailwind CSS	4.x	Estilização
Radix UI	latest	Componentes headless acessíveis
TanStack Query	5.x	Gerenciamento de estado do servidor
TanStack Table	8.x	Tabelas com sorting/filtering/paginação
react-hook-form	7.x	Formulários
Zod	3.x	Validação de schemas
Axios	1.x	Cliente HTTP
date-fns	4.x	Manipulação de datas
lucide-react	latest	Ícones
sonner	2.x	Notificações toast
class-variance-authority	0.7.x	Variantes de componentes
clsx + tailwind-merge	latest	Merge de classes
React Router	7.x	Roteamento (quando necessário)
Biome	2.x	Formatter (não usar Prettier)
ESLint	9.x	Linter
Regra: Nunca sugira substituir ou adicionar bibliotecas sem necessidade real. Prefira sempre as bibliotecas já presentes no projeto.
---
Estrutura de Diretórios
```
src/
├── api/              # Instâncias Axios por backend
├── components/
│   ├── atoms/        # Componentes primitivos (Button, Input, Badge...)
│   ├── molecules/    # Composição de atoms (DatePicker, SearchBar...)
│   └── organisms/    # Composição de molecules (Modal, FormStep...)
├── config/           # Variáveis de ambiente tipadas
├── constants/        # Constantes de UI e domínio
├── contexts/         # React Context providers
├── hooks/            # Custom hooks reutilizáveis
├── lib/              # Configurações de bibliotecas (queryClient, utils)
├── mappers/          # Transformação de dados API → UI
├── pages/            # Páginas, organizadas por rota em subpastas
├── routes/           # Definição centralizada de rotas (React Router)
├── services/         # Camada de integração com APIs
├── templates/        # Layouts reutilizáveis (DataTable, ModalProgress)
├── types/
│   ├── enums/        # Enums e mapas de valores
│   └── forms/        # Tipos específicos de formulários
└── utils/
    └── formatters/   # Funções de formatação de dados
```
Regra: Nunca crie arquivos fora dessas pastas sem justificativa. Nunca coloque lógica de negócio em componentes — delegue para hooks, services ou mappers.
---
Atomic Design
Atoms
Componentes primitivos sem dependências de negócio
Wrappers de Radix UI instalados via shadcn/ui CLI e elementos HTML com variantes via CVA
Exemplos: `Button`, `Input`, `Badge`, `Dialog`, `Select`, `Tabs`
Molecules
Combinação de atoms com lógica de UI simples
Exemplos: `DatePicker`, `SearchBar`, `TableActions`, `DatasetButton`
Organisms
Composição complexa de atoms e molecules com lógica de negócio
Exemplos: `UploadDocumentModal`, `ActionModal`, `BatchSettingsStep`
Templates
Layouts reutilizáveis que recebem componentes como children ou props
Exemplos: `DataTable`, `ModalProgress`
Pages
Uma página por rota, organizada em `pages/<nome-da-rota>/index.tsx`
Coordena organisms e templates
Não contém lógica de negócio diretamente — delega para hooks e contexts
Regra: Ao criar um componente, classifique-o corretamente no nível atômico antes de criar o arquivo.
---
Nomenclatura de Arquivos
Regra obrigatória: todos os arquivos usam `kebab-case`.
```
components/atoms/my-button.tsx
components/molecules/date-picker.tsx
hooks/use-batch-data.ts
services/batch-actions.ts
contexts/user.tsx
types/enums/status.ts
utils/formatters/format-date.ts
mappers/batch.mapper.ts
pages/batch-list/index.tsx
routes/index.tsx
```
Nunca use:
`PascalCase` para nomes de arquivos (`MyButton.tsx`)
`camelCase` para nomes de arquivos (`myButton.tsx`)
`snake_case` para nomes de arquivos (`my_button.tsx`)
---
Padrão de Exportação
Regra: Sempre usar `function` explícita e `export` no final do arquivo. Nunca usar `export default` nem `export` inline na declaração.
Correto
```typescript
function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}

export { MyComponent }
export type { MyComponentProps }
```
Incorreto
```typescript
// Nunca: export default
export default function MyComponent() { ... }

// Nunca: export inline
export function MyComponent() { ... }

// Nunca: arrow function anônima
const MyComponent = () => { ... }
export default MyComponent
```
Essa regra se aplica a: componentes, hooks, funções utilitárias, services, contexts, mappers.
---
Componentes
Estrutura padrão de componente
```typescript
import type * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
  // props específicas
}

function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}

export { MyComponent }
export type { MyComponentProps }
```
Componentes com variantes (CVA)
```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const myComponentVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "classes-default",
      secondary: "classes-secondary",
    },
    size: {
      default: "size-default",
      sm: "size-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface MyComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof myComponentVariants> {}

function MyComponent({ className, variant, size, ...props }: MyComponentProps) {
  return (
    <div
      className={cn(myComponentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { MyComponent, myComponentVariants }
```
Regras de componentes
Use `cn()` de `@/lib/utils` para merge de classes Tailwind
Aceite `className` como prop para permitir customização externa
Use `React.ComponentProps<"element">` para herdar props nativas
Para componentes acessíveis (Dialog, Tooltip, Select…), use os atoms de `src/components/atoms/` gerados via shadcn/ui — nunca importe Radix diretamente
Nunca use `any` — tipagem completa obrigatória
Evite lógica de negócio dentro de componentes — extraia para hooks
---
Hooks
Estrutura padrão de hook
```typescript
import { useCallback, useState } from "react"

interface UseMyHookOptions {
  optionalParam?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface UseMyHookReturn {
  data: DataType | null
  loading: boolean
  error: string | null
  execute: (param: string) => Promise<void>
  reset: () => void
}

function useMyHook({
  optionalParam,
  onSuccess,
  onError,
}: UseMyHookOptions = {}): UseMyHookReturn {
  const [data, setData] = useState<DataType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (param: string) => {
      setLoading(true)
      setError(null)
      try {
        // lógica
        onSuccess?.()
      } catch (err) {
        const msg = "Erro ao executar"
        setError(msg)
        onError?.(msg)
      } finally {
        setLoading(false)
      }
    },
    [optionalParam, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, execute, reset }
}

export { useMyHook }
export type { UseMyHookOptions, UseMyHookReturn }
```
Regras de hooks
Nome sempre começa com `use` em `camelCase`
Sempre declare interfaces para options e return
Exporte tipos junto com o hook
Para dados do servidor, use TanStack Query (`useQuery`, `useMutation`)
Acesse services via `ServiceFactory`, nunca instancie diretamente
`useEffect`, `useCallback` e `useMemo` são última instância — veja seção abaixo
---
useEffect, useCallback e useMemo
Esses três hooks são frequentemente usados em excesso, introduzindo bugs sutis e tornando o código difícil de rastrear. Use-os apenas quando não houver outra forma de atingir o comportamento desejado.
---
useEffect
Regra: use `useEffect` somente para sincronizar o componente com um sistema externo (DOM, WebSocket, postMessage, timers, subscriptions). Nunca para derivar estado ou reagir a mudanças de props que poderiam ser tratadas diretamente no render ou em handlers de evento.
Quando NÃO usar
```typescript
// ERRADO — derivar estado com useEffect
function BadComponent({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter((i) => i.active))
  }, [items])

  return <List items={filteredItems} />
}

// CERTO — calcular diretamente no render
function GoodComponent({ items }: { items: Item[] }) {
  const filteredItems = items.filter((i) => i.active)
  return <List items={filteredItems} />
}
```
```typescript
// ERRADO — buscar dados com useEffect + useState
useEffect(() => {
  fetchData(id).then(setData)
}, [id])

// CERTO — usar TanStack Query
const { data } = useQuery({
  queryKey: ["data", id],
  queryFn: () => ServiceFactory.getService().fetch(id),
})
```
```typescript
// ERRADO — reagir a mudança de prop para acionar lógica
useEffect(() => {
  if (isOpen) doSomething()
}, [isOpen])

// CERTO — acionar no handler de evento que mudou isOpen
function handleOpen() {
  setIsOpen(true)
  doSomething()
}
```
Quando usar
```typescript
// OK — sincronizar com sistema externo (postMessage)
useEffect(() => {
  function handleMessage(event: MessageEvent) {
    if (event.origin !== allowedOrigin) return
    setData(event.data)
  }
  window.addEventListener("message", handleMessage)
  return () => window.removeEventListener("message", handleMessage)
}, [allowedOrigin])

// OK — timer/intervalo
useEffect(() => {
  const id = setInterval(refetch, 3000)
  return () => clearInterval(id)
}, [refetch])

// OK — sincronizar título da página
useEffect(() => {
  document.title = `${pageTitle} | App`
}, [pageTitle])
```
---
useCallback
Regra: use `useCallback` apenas quando a identidade estável da função for estritamente necessária: ao passá-la como dependência de outro hook ou como prop de um componente memoizado com `React.memo`. Em todos os outros casos, declare a função diretamente.
Quando NÃO usar
```typescript
// ERRADO — useCallback sem necessidade real
function BadComponent({ onSave }: { onSave: () => void }) {
  const handleClick = useCallback(() => {
    onSave()
  }, [onSave])

  return <button onClick={handleClick}>Salvar</button>
}

// CERTO — função inline, sem overhead desnecessário
function GoodComponent({ onSave }: { onSave: () => void }) {
  return <button onClick={onSave}>Salvar</button>
}
```
Quando usar
```typescript
// OK — função passada como dependência de useEffect
const fetchData = useCallback(async () => {
  const result = await ServiceFactory.getService().list(userToken)
  setData(result)
}, [userToken])

useEffect(() => {
  fetchData()
}, [fetchData])

// OK — função passada para componente memoizado
const handleChange = useCallback((value: string) => {
  setFilter(value)
}, [])

return <MemoizedInput onChange={handleChange} />
```
```typescript
// OK — funções retornadas por hooks (pois o consumidor pode usá-las
// como dependência de hooks próprios)
function useMyHook(): UseMyHookReturn {
  const execute = useCallback(async (id: string) => {
    // ...
  }, [])

  return { execute }
}
```
---
useMemo
Regra: use `useMemo` apenas para cálculos genuinamente caros (iterações sobre listas grandes, transformações complexas) que seriam executados a cada render com resultado idêntico. Para valores simples, derivações baratas ou formatações, calcule diretamente no render.
Quando NÃO usar
```typescript
// ERRADO — cálculo simples não justifica useMemo
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
)

// CERTO — cálculo direto
const fullName = `${firstName} ${lastName}`
```
```typescript
// ERRADO — objeto simples não precisa ser memoizado
const style = useMemo(() => ({ color: "red" }), [])

// CERTO — mova para fora do componente se for estático
const style = { color: "red" } // fora do componente
```
Quando usar
```typescript
// OK — transformação custosa sobre lista grande
const processedRows = useMemo(
  () =>
    rawData.map((item) => ({
      ...item,
      label: formatLabel(item),
      status: StatusLabel[item.statusCode],
      formatted: heavyTransformation(item),
    })),
  [rawData]
)

// OK — cálculo de agregação sobre coleção grande
const totals = useMemo(
  () => rows.reduce((acc, row) => acc + row.value, 0),
  [rows]
)
```
---
Checklist mental antes de usar esses hooks
Antes de escrever `useEffect`, `useCallback` ou `useMemo`, responda:
useEffect: "Isso é sincronização com um sistema externo?" Se não → não use.
useCallback: "Esta função é dependência de outro hook ou prop de componente memoizado?" Se não → não use.
useMemo: "Este cálculo é visivelmente lento ou causa rerenders perceptíveis sem memo?" Se não → não use.
---
Componentes Radix UI via shadcn/ui
Regra: todos os wrappers de componentes Radix UI neste projeto são instalados e gerados via shadcn/ui. Nunca importe ou instancie componentes Radix UI diretamente nos componentes de negócio — use sempre os atoms de `src/components/atoms/` que encapsulam e padronizam o Radix.
Adicionando um novo componente shadcn/ui
Siga sempre a documentação oficial em ui.shadcn.com/docs:
```bash
# Instalar um componente via CLI shadcn
pnpm dlx shadcn@latest add <componente>

# Exemplos:
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add tooltip
```
O CLI:
Instala as dependências Radix necessárias via `pnpm`
Gera o arquivo do componente em `src/components/ui/` por padrão
Após o comando, mova o arquivo gerado para o nível atômico correto:
`src/components/ui/<componente>.tsx` → `src/components/atoms/<componente>.tsx`
Configuração (components.json)
O projeto já tem `components.json` configurado na raiz. Nunca altere manualmente as entradas `aliases` sem alinhar com o time:
```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/atoms",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```
Padrão de uso dos atoms gerados
Após mover e ajustar o componente:
Mantenha a estrutura gerada pelo shadcn (não reescreva do zero)
Aplique `function` explícita + `export { }` no final (converter do padrão de export inline do shadcn)
Use `cn()` já importado de `@/lib/utils`
Não remova `data-slot` attributes — são usados pelo Tailwind para estilização condicional
```typescript
// Antes (padrão gerado pelo shadcn — ajustar):
export function Dialog({ ...props }) { ... }

// Depois (padrão do projeto):
function Dialog({ ...props }) { ... }

export { Dialog }
```
O que NÃO fazer com shadcn/ui
Nunca instale dependências Radix manualmente com `pnpm add @radix-ui/...` — deixe o CLI do shadcn gerenciar
Nunca copie e cole código de exemplos da documentação sem passar pelo CLI primeiro
Nunca importe de `@radix-ui/*` diretamente em componentes fora de `src/components/atoms/`
Nunca modifique a lógica interna dos atoms gerados para atender casos específicos — crie molecules ou organisms por cima
---
Services
Estrutura padrão de service
```typescript
import { apiClient } from "@/api/batch"
import { BaseService } from "@/services/base-service"
import type { ServiceErrorResponse } from "@/services/service-response"
import type { CreateItemSchema, ItemResponseSchema } from "@/types/item"

class ItemService extends BaseService {
  private readonly endpoint = "/items"

  async list(
    page: number,
    perPage: number,
    userToken: string
  ): Promise<ItemResponseSchema[] | ServiceErrorResponse> {
    try {
      const response = await apiClient.get(this.endpoint, {
        params: { page, per_page: perPage },
        headers: this.getHeaders(userToken),
      })
      return response.data
    } catch (error) {
      return this.handleError(error, "Erro ao listar itens")
    }
  }

  async create(
    params: CreateItemSchema,
    userToken?: string
  ): Promise<ItemResponseSchema | ServiceErrorResponse> {
    try {
      const response = await apiClient.post(this.endpoint, params, {
        headers: this.getHeaders(userToken),
      })
      return response.data
    } catch (error) {
      return this.handleError(error, "Erro ao criar item")
    }
  }
}

export { ItemService }
```
ServiceFactory (singleton)
```typescript
// Registrar novo service em service-factory.ts
static getItemService(): ItemService {
  return getInstance<ItemService>("ItemService", () => new ItemService())
}
```
Regras de services
Toda service estende `BaseService`
Todo método usa `try/catch` com `this.handleError()`
Use `this.getHeaders(userToken)` para autenticação
Instancie sempre via `ServiceFactory`, nunca com `new`
Nome da classe termina em `Service` (PascalCase)
Endpoint declarado como `private readonly`
Nunca chame services diretamente em componentes — use hooks
---
Contexts
Estrutura padrão de context
```typescript
import { createContext, useCallback, useState } from "react"
import type { ReactNode } from "react"

interface MyContextType {
  value: string
  loading: boolean
  setValue: (value: string) => void
}

const MyContext = createContext<MyContextType | undefined>(undefined)

interface MyProviderProps {
  children: ReactNode
}

function MyProvider({ children }: MyProviderProps) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSetValue = useCallback((newValue: string) => {
    setLoading(true)
    setValue(newValue)
    setLoading(false)
  }, [])

  return (
    <MyContext.Provider value={{ value, loading, setValue: handleSetValue }}>
      {children}
    </MyContext.Provider>
  )
}

export { MyContext, MyProvider }
export type { MyContextType }
```
Hook de acesso ao context
Crie sempre um hook em `hooks/use-my-context.ts`:
```typescript
import { useContext } from "react"
import { MyContext } from "@/contexts/my-context"

function useMyContext() {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error("useMyContext deve ser usado dentro de MyProvider")
  }
  return context
}

export { useMyContext }
```
Regras de contexts
Nunca use `useContext` diretamente nos componentes — sempre via hook dedicado
Provider registrado em `app.tsx` na ordem correta de dependências
Use `useCallback` para todas as funções expostas pelo context
Contexts gerenciam estado do cliente; TanStack Query gerencia estado do servidor
---
Tipos e Enums
Enums como const objects
```typescript
const StatusMap = {
  PENDING: 0,
  ACTIVE: 1,
  FINISHED: 2,
  ERROR: 3,
} as const

type StatusEnum = (typeof StatusMap)[keyof typeof StatusMap]

const StatusLabel = invertMapper(StatusMap)

export { StatusMap, StatusLabel }
export type { StatusEnum }
```
Schemas Zod para validação
```typescript
import { z } from "zod"

const CreateItemSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  date: z.date().optional(),
})

type CreateItemSchema = z.infer<typeof CreateItemSchema>

export { CreateItemSchema }
```
Regras de tipos
Toda entidade de domínio tem seu arquivo em `src/types/`
Enums são `const objects` com `as const`, nunca `enum` do TypeScript
Schemas Zod para validação de formulários e dados de API
Tipos de formulário ficam em `types/forms/`
Nunca use `any` — use `unknown` quando o tipo não é conhecido
---
Mappers
```typescript
import type { ApiResponse } from "@/types/api"
import type { UIModel } from "@/types/domain"

function mapToUIModel(raw: ApiResponse): UIModel {
  return {
    id: raw.id,
    label: raw.name,
    status: StatusLabel[raw.status_code],
    formattedDate: formatDate(raw.created_at),
  }
}

export { mapToUIModel }
```
Regra: Todo dado de API deve passar por um mapper antes de ser exibido. Nunca acesse propriedades `snake_case` da API diretamente nos componentes.
---
Rotas (React Router)
Quando o projeto precisar de roteamento, use React Router e centralize as rotas:
```typescript
// src/routes/index.tsx
import { createBrowserRouter } from "react-router"
import { BatchListPage } from "@/pages/batch-list"
import { BatchDetailPage } from "@/pages/batch-detail"
import { SettingsPage } from "@/pages/settings"

const router = createBrowserRouter([
  {
    path: "/",
    element: <BatchListPage />,
  },
  {
    path: "/batch/:id",
    element: <BatchDetailPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
])

export { router }
```
```typescript
// src/main.tsx
import { RouterProvider } from "react-router"
import { router } from "@/routes"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
)
```
Regras de rotas:
Rotas definidas exclusivamente em `src/routes/index.tsx`
Nunca use `<Link>` ou `useNavigate` fora de componentes de página
Cada rota corresponde a uma pasta em `src/pages/<nome-kebab-case>/index.tsx`
---
Formulários
```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
})

type FormValues = z.infer<typeof formSchema>

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  })

  function onSubmit(values: FormValues) {
    // chamar service via hook
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}
```
Regras de formulários:
Sempre use `react-hook-form` + `zod` + `@hookform/resolvers`
Schema Zod declarado fora do componente
Lógica de submit delegada para hooks ou services, nunca inline
---
Queries e Mutations (TanStack Query)
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ServiceFactory } from "@/services/service-factory"

function useItems(userToken: string) {
  return useQuery({
    queryKey: ["items", userToken],
    queryFn: () => ServiceFactory.getItemService().list(userToken),
    staleTime: 0,
    enabled: !!userToken,
  })
}

function useCreateItem(userToken: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateItemSchema) =>
      ServiceFactory.getItemService().create(params, userToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })
}

export { useItems, useCreateItem }
```
Regras:
`queryKey` sempre com array descritivo incluindo parâmetros relevantes
`staleTime: 0` para dados que mudam com frequência
Mutations invalidam queries relacionadas no `onSuccess`
Nunca chame `fetch` ou Axios diretamente em componentes
---
Estilização
Regras de Tailwind
Use `cn()` de `@/lib/utils` para merge de classes
Variantes de componente via CVA (`class-variance-authority`)
Responsive: breakpoints Tailwind padrão + `3xl` customizado do projeto
Dark mode via `next-themes` com classe `dark:`
Nunca use estilos inline (`style={{}}`) quando Tailwind for suficiente
cn() utility
```typescript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
---
Formatação e Linting
Formatter: Biome (não Prettier)
Indent: 4 espaços
Quotes: duplas (`"`)
Semicolons: apenas quando necessário (Biome `asNeeded`)
Line width: 80 caracteres
Trailing commas: ES5
Executar formatação
```bash
pnpm exec biome format --write src/
pnpm lint
```
Regra: Todo código gerado deve seguir essas regras de formatação. Nunca use aspas simples em TypeScript/TSX.
---
Padrões de Importação
Ordem de imports
Bibliotecas externas (`react`, `@tanstack/...`)
Aliases internos com `@/` — sempre em ordem: `@/components`, `@/contexts`, `@/hooks`, `@/lib`, `@/services`, `@/types`, `@/utils`
Imports relativos (`./`, `../`)
Alias configurado
```typescript
// tsconfig.json — "@/*" → "./src/*"
import { Button } from "@/components/atoms/button"
import { useUser } from "@/hooks/use-user"
import { ServiceFactory } from "@/services/service-factory"
```
Nunca use caminhos relativos longos (`../../../components/...`). Use sempre `@/`.
Import de tipos
```typescript
// Sempre use "import type" para tipos que não são usados em runtime
import type { ReactNode } from "react"
import type { BatchSchema } from "@/types/batch"
```
---
Toasts e Feedback ao Usuário
```typescript
import { showCustomToast } from "@/components/atoms/custom-toast"

// Sucesso
showCustomToast({ title: "Operação realizada", variant: "success" })

// Erro
showCustomToast({ title: "Erro", description: err.message, variant: "error" })

// Info
showCustomToast({ title: "Processando...", variant: "info" })
```
Regra: Nunca importe `sonner` diretamente nos componentes. Use sempre `showCustomToast`.
---
Variáveis de Ambiente
```typescript
// src/config/env.ts — acesso tipado às env vars
import { env } from "@/config/env"

const url = env.VITE_BATCH_CONFIG_URL
```
Nunca acesse `import.meta.env` diretamente fora de `src/config/env.ts`.
---
Gestão de Pacotes (pnpm)
Regra: Este projeto usa exclusivamente `pnpm`. Nunca use `npm` ou `yarn`.
Comandos essenciais
```bash
# Instalar dependências
pnpm install

# Adicionar dependência de produção
pnpm add <pacote>

# Adicionar dependência de desenvolvimento
pnpm add -D <pacote>

# Remover dependência
pnpm remove <pacote>

# Atualizar pacote para a versão mais recente permitida pelo range
pnpm update <pacote>

# Atualizar pacote para uma versão específica
pnpm add <pacote>@<versão>

# Atualizar todos os pacotes (dentro dos ranges do package.json)
pnpm update

# Ver versões desatualizadas
pnpm outdated

# Executar script do projeto
pnpm <script>          # ex: pnpm dev, pnpm build, pnpm lint

# Executar binário local sem script
pnpm exec <binário>    # ex: pnpm exec biome format --write src/
```
Regras de pacotes
Nunca faça commit sem o `pnpm-lock.yaml` atualizado
Nunca edite `pnpm-lock.yaml` manualmente
Nunca use `--legacy-peer-deps` — investigue incompatibilidades reais
Adicione versões exatas (`pnpm add pacote@1.2.3`) quando a estabilidade for crítica
Use `pnpm add -D` para ferramentas de build/lint que não vão para produção
---
Segurança de Dependências
Auditoria de vulnerabilidades
Antes de qualquer PR ou ao adicionar/atualizar pacotes, execute:
```bash
# Auditar vulnerabilidades conhecidas
pnpm audit

# Auditoria apenas de produção (ignora devDependencies)
pnpm audit --prod

# Ver detalhes completos de cada vulnerabilidade
pnpm audit --json
```
Fluxo de resolução de vulnerabilidades
1. Identificar:
```bash
pnpm audit
```
O relatório mostra: pacote afetado, severidade (`low`, `moderate`, `high`, `critical`), CVE, e versão corrigida.
2. Avaliar:
`critical` / `high` em dependências de produção → corrigir antes do merge
`moderate` → corrigir na mesma sprint
`low` → registrar e corrigir no próximo ciclo
`high` / `critical` apenas em `devDependencies` → menor urgência, mas corrigir assim que possível
3. Corrigir — ordem de preferência:
```bash
# Opção A: atualizar para versão corrigida (preferida)
pnpm add <pacote>@<versão-corrigida>

# Opção B: se a versão corrigida quebra compatibilidade, buscar a última versão
# da mesma major sem vulnerabilidade
pnpm add <pacote>@<última-patch-segura>

# Opção C: se não houver versão segura na major atual, avaliar upgrade de major
# com o time antes de executar
pnpm add <pacote>@<nova-major>
```
4. Verificar regressões após atualização:
```bash
pnpm install
pnpm build
pnpm lint
# Revisar manualmente as funcionalidades afetadas pelo pacote atualizado
```
5. Confirmar que a vulnerabilidade foi resolvida:
```bash
pnpm audit
```
Critérios para downgrade vs upgrade
Situação	Ação
Versão patch disponível sem vulnerabilidade	Atualizar para o patch (`^x.y.Z`)
Vulnerabilidade corrigida apenas em major superior	Avaliar breaking changes; se compatível, fazer upgrade
Nenhuma versão sem vulnerabilidade disponível	Abrir issue, adicionar override se possível, substituir biblioteca
Dependência transitiva vulnerável	Usar `pnpm.overrides` no `package.json`
Overrides para dependências transitivas
Quando a vulnerabilidade está em uma dependência transitiva (não direta), use `overrides` no `package.json`:
```json
{
  "pnpm": {
    "overrides": {
      "pacote-vulneravel": ">=versão-corrigida"
    }
  }
}
```
Após adicionar o override:
```bash
pnpm install
pnpm audit
```
Priorização por severidade
```
critical → bloqueia merge, corrigir imediatamente
high     → corrigir antes do próximo deploy
moderate → corrigir na sprint atual
low      → agendar para próxima sprint
```
O que NÃO fazer em vulnerabilidades
Nunca use `pnpm audit --fix` sem revisar o que será alterado — pode introduzir breaking changes silenciosos
Nunca ignore `critical` ou `high` em dependências de produção
Nunca faça downgrade para versão com vulnerabilidade conhecida mais grave
Nunca atualize múltiplas dependências em um único commit sem testar — isole cada atualização
---
Checklist de Revisão de Código
Ao revisar ou gerar código, verifique cada item:
Arquivos e Nomenclatura
[ ] Nome do arquivo em `kebab-case`
[ ] Arquivo no diretório correto conforme estrutura de pastas
[ ] Componente classificado corretamente (atom/molecule/organism/template/page)
Exports e Funções
[ ] Função declarada com `function` explícita (não arrow function)
[ ] Export no final do arquivo com `export { ... }`
[ ] Sem `export default`
[ ] Tipos exportados com `export type { ... }`
TypeScript
[ ] Sem `any` — usar `unknown` ou tipagem específica
[ ] Interfaces para props, options e returns de hooks
[ ] `import type` para imports usados apenas como tipo
Componentes
[ ] Usa `cn()` para merge de classes
[ ] Aceita `className` como prop quando relevante
[ ] Sem lógica de negócio — delegada para hooks
Hooks
[ ] Nome começa com `use`
[ ] Interfaces `UseXxxOptions` e `UseXxxReturn` declaradas
[ ] `useCallback` apenas quando a identidade da função é dependência de outro hook ou prop de componente memoizado
[ ] `useMemo` apenas para cálculos genuinamente caros, não para derivações simples
[ ] `useEffect` apenas para sincronização com sistemas externos, não para derivar estado ou reagir a props
[ ] Service acessado via `ServiceFactory`
Services
[ ] Estende `BaseService`
[ ] Todo método com `try/catch` e `this.handleError()`
[ ] Registrado no `ServiceFactory`
[ ] Nunca instanciado com `new` fora da factory
Contexts
[ ] Hook dedicado em `hooks/use-xxx-context.ts`
[ ] Provider registrado em `app.tsx`
[ ] `useCallback` em funções expostas pelo context (consumidores podem usá-las como dependência)
Componentes Radix / shadcn/ui
[ ] Novo componente Radix instalado via `pnpm dlx shadcn@latest add <componente>`
[ ] Arquivo gerado movido de `src/components/ui/` para `src/components/atoms/`
[ ] Export convertido para `function` explícita + `export { }` no final
[ ] Nenhum import direto de `@radix-ui/*` fora de `src/components/atoms/`
Estilização
[ ] Tailwind com `cn()` — sem estilos inline desnecessários
[ ] Variantes via CVA quando houver múltiplos estados visuais
Formatação
[ ] Aspas duplas
[ ] 4 espaços de indentação
[ ] Imports de tipo com `import type`
Pacotes e Segurança
[ ] Dependências instaladas/atualizadas com `pnpm` (nunca `npm` ou `yarn`)
[ ] `pnpm-lock.yaml` atualizado e incluído no commit
[ ] `pnpm audit` executado — sem vulnerabilidades `high` ou `critical` em produção
[ ] Pacotes novos adicionados como `dependencies` ou `devDependencies` conforme uso
[ ] Dependências transitivas vulneráveis tratadas via `pnpm.overrides`
---
O que NÃO fazer
Nunca use `export default`
Nunca use arrow functions como declaração principal de componentes ou hooks
Nunca instancie services com `new` — use `ServiceFactory`
Nunca acesse `import.meta.env` diretamente — use `src/config/env.ts`
Nunca use `any`
Nunca chame APIs diretamente em componentes — use hooks + services
Nunca use `useContext` diretamente em componentes — use hooks dedicados
Nunca nomeie arquivos em `PascalCase` ou `camelCase`
Nunca use `useEffect` para derivar estado, buscar dados ou reagir a mudanças de props — há alternativas diretas
Nunca use `useCallback` ou `useMemo` por precaução ou "por garantia" — use apenas quando houver necessidade demonstrável
Nunca instale `@radix-ui/*` manualmente — use `pnpm dlx shadcn@latest add`
Nunca importe de `@radix-ui/*` diretamente fora de `src/components/atoms/`
Nunca use Prettier — o projeto usa Biome
Nunca adicione bibliotecas novas sem necessidade real
Nunca use `npm install` ou `yarn add` — use exclusivamente `pnpm`
Nunca faça commit sem executar `pnpm audit` quando pacotes forem alterados
Nunca ignore vulnerabilidades `critical` ou `high` em dependências de produção
Nunca use `pnpm audit --fix` sem revisar o diff completo antes
Nunca edite `pnpm-lock.yaml` manualmente
Nunca use `--legacy-peer-deps`