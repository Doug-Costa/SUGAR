---
id: "fe2e5fca-6980-4512-99d3-260f8ab454d1"
title: "[BOOTSTRAP] Laravel 11 + React + Dual DB + DDD Structure"
assignee: ""
status: 1
createdAt: "2026-04-09T19:25:34.589Z"
updatedAt: "2026-04-09T19:29:24.119Z"
type: ticket
---

# [BOOTSTRAP] Laravel 11 + React + Dual DB + DDD Structure

## Objetivo

Inicializar o projeto SUGAR com toda a infraestrutura base: Laravel 11, React 18 + TypeScript (via Vite), suporte a duas conexões de banco de dados e estrutura de pastas DDD.

## Tarefas

### 1. Projeto Laravel 11

- Criar projeto via `composer create-project laravel/laravel sugar`.
- Instalar dependências:
  - `laravel/sanctum` — autenticação SPA.
  - `maatwebsite/excel` — exports CSV.
  - `barryvdh/laravel-dompdf` — exports PDF.
  - `spatie/laravel-permission` — roles e policies.
- Publicar configs do Sanctum e configurar CORS para o frontend React.

### 2. Frontend React

- Inicializar com `npm create vite@latest resources/js -- --template react-ts`.
- Configurar `vite.config.ts` integrado ao Laravel (plugin `laravel-vite-plugin`).
- Instalar: `axios`, `react-router-dom`, `@tanstack/react-query`.

### 3. Dual Database

Em `config/database.php`, adicionar a conexão `woocommerce`:

```php
'woocommerce' => [
    'driver' => 'mysql',
    'host' => env('WC_DB_HOST'),
    'database' => env('WC_DB_DATABASE'),
    'prefix' => env('WC_DB_PREFIX', 'wp_'),
    // ...
],
```

Adicionar todas as variáveis `WC_DB_*` ao `.env.example`.

### 4. Estrutura DDD de Pastas

Criar a estrutura de diretórios conforme a spec:

```
app/Domain/Authors/
app/Domain/Books/
app/Domain/Financial/
app/Application/Providers/
app/Application/Webhooks/
app/Infrastructure/Persistence/
app/Infrastructure/External/
```

Adicionar `app/Domain` e `app/Infrastructure` ao `composer.json` autoload PSR-4.

### 5. Configuração Base

- Configurar `AppServiceProvider` para usar UUIDs como chave primária padrão.
- Criar `SecondaryDatabaseProvider` em `app/Application/Providers/` que registra e valida a conexão WooCommerce na inicialização.

## Critérios de Aceite

php artisan serve sobe sem erros.npm run dev compila o frontend sem erros.php artisan tinker consegue conectar nas duas conexões de banco.Estrutura de pastas DDD criada e reconhecida pelo autoloader..env.example contém todas as variáveis necessárias (SUGAR + WooCommerce).
