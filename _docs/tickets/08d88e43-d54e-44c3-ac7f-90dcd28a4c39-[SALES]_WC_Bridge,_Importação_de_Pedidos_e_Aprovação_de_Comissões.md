---
id: "08d88e43-d54e-44c3-ac7f-90dcd28a4c39"
title: "[SALES] WC Bridge, Importação de Pedidos e Aprovação de Comissões"
assignee: ""
status: 0
createdAt: "2026-04-09T19:26:29.821Z"
updatedAt: "2026-04-09T19:26:44.379Z"
type: ticket
---

# [SALES] WC Bridge, Importação de Pedidos e Aprovação de Comissões

## Objetivo

Implementar a ponte com o WooCommerce (read-only), o job de importação de pedidos e o fluxo de aprovação manual de comissões pelo Admin.

## Tarefas

### 1. WC Bridge Models (Infrastructure/External)

- `WcOrderModel` — `$connection = 'woocommerce'`, mapeia `{prefix}posts` onde `post_type = 'shop_order'`.
- `WcOrderItemModel` — mapeia `{prefix}woocommerce_order_items`.
- `WcOrderMetaModel` — mapeia `{prefix}postmeta` para metadados do pedido.
- `WcAbandonedCartModel` — mapeia tabela do plugin de carrinho abandonado (configurável via `.env`: `WC_ABANDONED_CART_TABLE`).
- **Todos os models são read-only**: sobrescrever `save()`, `update()`, `delete()` para lançar `ReadOnlyModelException`.

### 2. Job de Importação

`ImportWooCommerceOrdersJob`:

- Busca pedidos WC com status `completed` ou `processing` criados/atualizados desde a última importação.
- Para cada pedido, identifica o produto (`wc_product_id`) e cruza com `books`.
- Chama `SplitEngine::calculate()` com os `FeeTemplates` ativos.
- Persiste `Commission` com status `pending`.
- Registra `last_imported_at` em uma tabela de configuração `system_settings`.
- Agendado para rodar a cada hora via `Kernel.php`.

### 3. Aprovação Manual

- `PATCH /api/admin/commissions/{commission}/confirm` — muda status para `confirmed`.
- `PATCH /api/admin/commissions/{commission}/reject` — muda status para `rejected` com campo `rejection_reason`.
- Apenas Admin pode executar essas ações.
- Evento `CommissionConfirmed` / `CommissionRejected` disparado para futura integração com notificações.

### 4. API de Comissões

- `GET /api/admin/commissions` — lista com filtros: `date_from`, `date_to`, `author_id`, `book_id`, `wc_order_id`, `status`.
- `GET /api/author/commissions` — lista apenas as comissões do autor autenticado (respeita `show_fee_detail`).
- `GET /api/admin/commissions/{commission}` — detalhe completo.

### 5. Dashboard de Carrinhos Abandonados

- `GET /api/admin/abandoned-carts` — lista carrinhos do WooCommerce com: cliente, itens, valor total, data de abandono.
- Paginação de 25 itens por página.

## Critérios de Aceite

ImportWooCommerceOrdersJob não cria duplicatas (idempotente por wc_order_id + author_id).Nenhuma escrita é feita no banco WooCommerce (testes de integração verificam isso).Admin consegue confirmar/rejeitar comissão via API.Author só vê suas próprias comissões.fee_breakdown é filtrado conforme show_fee_detail do autor.Endpoint de carrinhos abandonados retorna dados paginados.
