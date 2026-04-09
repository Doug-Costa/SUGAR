---
id: "f58d242b-3c9b-4920-aa39-7f5e212ac20d"
title: "[REPORTS] Filtros Cruzados, Exports CSV/PDF e Transparência por Autor"
assignee: ""
status: 0
createdAt: "2026-04-09T19:26:45.171Z"
updatedAt: "2026-04-09T19:26:57.925Z"
type: ticket
---

# [REPORTS] Filtros Cruzados, Exports CSV/PDF e Transparência por Autor

## Objetivo

Implementar o módulo de relatórios com filtros cruzados, exportação assíncrona em CSV e PDF, e controle de transparência de taxas por autor.

## Tarefas

### 1. Report Query Builder

Classe `app/Domain/Financial/ReportQueryBuilder.php`:

- Aceita filtros: `date_from`, `date_to`, `author_id`, `book_id`, `wc_order_id`, `status`, `currency`.
- Aplica filtros dinamicamente via Eloquent scopes.
- Retorna coleção paginada de `Commission` com relações `author`, `book`.

### 2. Export CSV

- Classe `CommissionsExport` implementando `maatwebsite/excel` `FromQuery + WithHeadings`.
- Colunas: Pedido WC, Autor, Livro, Bruto, Taxas (se `show_fee_detail`), Líquido, Moeda, Status, Data.
- Endpoint `POST /api/reports/export/csv` — dispara job assíncrono, retorna `job_id`.
- Endpoint `GET /api/reports/export/status/{job_id}` — retorna status do job e URL de download quando pronto.

### 3. Export PDF

- Template Blade `resources/views/reports/commissions.blade.php` com tabela formatada.
- Classe `CommissionsPdfExport` usando `barryvdh/laravel-dompdf`.
- Endpoint `POST /api/reports/export/pdf` — mesmo padrão assíncrono do CSV.
- PDF inclui: logo SUGAR, período do relatório, totais por autor, detalhamento de taxas (condicional).

### 4. Controle de Transparência

- Endpoint `PATCH /api/admin/authors/{author}/fee-visibility` — Admin alterna `show_fee_detail`.
- Toda resposta de comissão para o autor passa pelo `CommissionResource` que omite `fee_breakdown` se `show_fee_detail = false`.

### 5. Frontend — Tela de Relatórios

- Componente `ReportsPage` com:
  - Painel de filtros (data range picker, selects de autor/livro, input de order ID).
  - Tabela de resultados com paginação.
  - Botões "Exportar CSV" e "Exportar PDF" com feedback de progresso (polling do status do job).
- Rota `/admin/reports` e `/author/reports`.

## Critérios de Aceite

Filtros cruzados funcionam em combinação (ex: autor + livro + período).Export CSV gerado corretamente para 10.000+ registros sem timeout (assíncrono).Export PDF renderiza corretamente com e sem fee_breakdown.Author não vê fee_breakdown quando show_fee_detail = false.URL de download do export expira após 24h.
