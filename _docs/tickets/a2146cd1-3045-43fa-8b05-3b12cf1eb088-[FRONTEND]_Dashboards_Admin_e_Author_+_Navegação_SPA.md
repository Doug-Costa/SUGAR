---
id: "a2146cd1-3045-43fa-8b05-3b12cf1eb088"
title: "[FRONTEND] Dashboards Admin e Author + Navegação SPA"
assignee: ""
status: 0
createdAt: "2026-04-09T19:26:58.325Z"
updatedAt: "2026-04-09T19:27:12.525Z"
type: ticket
---

# [FRONTEND] Dashboards Admin e Author + Navegação SPA

## Objetivo

Implementar as telas React completas para Admin e Author, incluindo navegação SPA, componentes reutilizáveis e integração com todos os endpoints da API.

## Tarefas

### 1. Estrutura de Rotas React

```
/login                    → LoginPage
/forgot-password          → ForgotPasswordPage
/reset-password           → ResetPasswordPage
/admin                    → AdminLayout (protegido role:admin)
  /admin/dashboard        → AdminDashboardPage
  /admin/commissions      → CommissionsPage
  /admin/authors          → AuthorsPage
  /admin/books            → BooksPage
  /admin/fee-templates    → FeeTemplatesPage
  /admin/exchange-rates   → ExchangeRatesPage
  /admin/abandoned-carts  → AbandonedCartsPage
  /admin/reports          → ReportsPage
  /admin/users            → UsersPage
/author                   → AuthorLayout (protegido role:author)
  /author/dashboard       → AuthorDashboardPage
  /author/commissions     → AuthorCommissionsPage
  /author/books           → AuthorBooksPage
  /author/reports         → AuthorReportsPage
```

### 2. Componentes Compartilhados

- `<Sidebar>` — navegação lateral responsiva com links por role.
- `<DataTable>` — tabela genérica com paginação, ordenação e loading skeleton.
- `<FilterBar>` — painel de filtros com date range picker, selects e inputs.
- `<StatusBadge>` — badge colorido para status de comissão.
- `<ExportButton>` — botão com polling de status do job de export.
- `<CoverUpload>` — componente de upload de imagem com preview.

### 3. Admin Dashboard

- Cards de KPIs: vendas do mês, comissões confirmadas, pendentes, carrinhos abandonados.
- Tabela de comissões pendentes com ações de Confirmar/Rejeitar inline.
- Gráfico simples de vendas por período (usando dados da API).

### 4. Author Dashboard

- Cards: total confirmado no mês, pendente, livros ativos.
- Tabela de extrato de comissões com `fee_breakdown` condicional.
- Botões de export CSV/PDF.

### 5. Gerenciamento (Admin)

- CRUD completo de Authors, Books, FeeTemplates via modais.
- Tela de Exchange Rates com formulário de taxa manual e configuração de API.
- Tela de Abandoned Carts com tabela paginada (read-only).
- Tela de Users com vínculo User-Author.

### 6. API Client

- Configurar `axios` com `baseURL`, interceptor de CSRF token (Sanctum) e interceptor de erro 401 (redirect para login).
- Hooks React Query para cada recurso: `useCommissions`, `useAuthors`, `useBooks`, `useFeeTemplates`, `useExchangeRates`.

## Critérios de Aceite

Navegação entre rotas funciona sem reload de página.Usuário author não consegue acessar rotas /admin/* (redirect para /author).Tabelas com mais de 25 registros exibem paginação.Ações de Confirmar/Rejeitar atualizam a tabela sem reload.Upload de capa exibe preview antes de enviar.Export mostra spinner e link de download quando pronto.
