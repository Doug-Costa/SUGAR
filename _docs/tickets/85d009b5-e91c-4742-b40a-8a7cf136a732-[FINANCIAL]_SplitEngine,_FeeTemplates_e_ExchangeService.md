---
id: "85d009b5-e91c-4742-b40a-8a7cf136a732"
title: "[FINANCIAL] SplitEngine, FeeTemplates e ExchangeService"
assignee: ""
status: 0
createdAt: "2026-04-09T19:26:12.872Z"
updatedAt: "2026-04-09T19:26:29.023Z"
type: ticket
---

# [FINANCIAL] SplitEngine, FeeTemplates e ExchangeService

## Objetivo

Implementar o coração financeiro do SUGAR: o motor de cálculo de splits (`SplitEngine`), o sistema de taxas dinâmicas (`FeeTemplate` / `FeeStrategy`) e o serviço de câmbio multi-moeda (`ExchangeService`).

## Tarefas

### 1. Migrations

- **`fee_templates`**: `id` (UUID), `name`, `type` (enum: `percentage`, `fixed`), `value` (decimal 10,4), `visible_to_author` (bool), `currency` (string, default `BRL`), `active` (bool), `timestamps`.
- **`exchange_rates`**: `id` (UUID), `from_currency`, `to_currency`, `rate` (decimal 10,6), `source` (enum: `manual`, `api`), `api_url` (nullable), `fetched_at` (timestamp nullable), `timestamps`.
- **`commissions`**: conforme spec — todos os campos listados na seção 7.2.

### 2. FeeStrategy (Strategy Pattern)

- Interface `FeeStrategy` com método `apply(float $grossValue): FeeResult`.
- `PercentageFeeStrategy` — aplica percentual sobre o valor.
- `FixedFeeStrategy` — deduz valor fixo.
- `FeeResult` value object: `{ deductedAmount: float, feeName: string, feeTemplateId: UUID }`.

### 3. SplitEngine

Classe `app/Domain/Financial/SplitEngine.php`:

```php
public function calculate(
    float $grossValue,
    Collection $feeTemplates,
    Collection $authorships
): SplitResult
```

- Aplica cada `FeeStrategy` em sequência sobre o valor bruto.
- Acumula o `fee_breakdown` (array de `FeeResult`).
- Distribui o valor líquido entre os autores conforme `royalty_percentage`.
- Retorna `SplitResult` com: `netValue`, `feeBreakdown[]`, `authorShares[]`.

### 4. ExchangeService

Classe `app/Domain/Financial/ExchangeService.php`:

- `getRate(string $from, string $to): float` — busca a taxa mais recente no banco.
- `fetchFromApi(ExchangeRate $config): void` — faz HTTP GET na `api_url` configurada, parseia a resposta e persiste nova taxa.
- `setManualRate(string $from, string $to, float $rate): void` — Admin insere taxa manualmente.
- Job `FetchExchangeRateJob` agendado via `app/Console/Kernel.php` (diário).

### 5. API de FeeTemplates

- `GET/POST /api/admin/fee-templates`
- `GET/PUT/DELETE /api/admin/fee-templates/{template}`
- Apenas Admin pode gerenciar.

### 6. API de Câmbio

- `GET /api/admin/exchange-rates` — lista taxas.
- `POST /api/admin/exchange-rates/manual` — insere taxa manual.
- `POST /api/admin/exchange-rates/configure-api` — salva URL da API de câmbio.
- `POST /api/admin/exchange-rates/fetch-now` — dispara `FetchExchangeRateJob` imediatamente.

## Critérios de Aceite

SplitEngine::calculate() retorna valores corretos para cenários de taxa percentual e fixa.fee_breakdown contém apenas taxas com visible_to_author = true quando consultado pelo autor.ExchangeService::getRate() retorna a taxa mais recente.Job de câmbio executa sem erros e persiste nova taxa.Testes unitários para SplitEngine com ao menos 3 cenários (sem taxa, taxa percentual, taxa fixa).
