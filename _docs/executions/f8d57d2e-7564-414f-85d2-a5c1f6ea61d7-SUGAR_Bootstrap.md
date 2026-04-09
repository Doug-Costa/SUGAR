---
id: "f8d57d2e-7564-414f-85d2-a5c1f6ea61d7"
title: "SUGAR Bootstrap"
createdAt: "1775762999934"
updatedAt: "1775763136581"
type: execution
---

### User Query (Status: Completed)

Implement the SUGAR project bootstrap as described in `ticket:[BOOTSTRAP] Laravel 11 + React + Dual DB + DDD Structure`, following the architecture defined in spec:a1461207-0f68-4594-b1fd-f97201e3a314/d1d40158-f0df-46ab-bfdf-53b121a5c057.

The workspace root is `e:\SUGAR\`. Create all files directly inside this directory (do NOT create a nested `sugar/` subfolder).

## What to implement

### 1. Laravel 11 Project Files

Scaffold a complete Laravel 11 project structure inside `e:\SUGAR\`. This means creating all standard Laravel files: `artisan`, `composer.json`, `composer.lock` (stub), `bootstrap/`, `config/`, `database/`, `public/`, `resources/`, `routes/`, `storage/`, `tests/`, etc.

Key `composer.json` requirements:

- `laravel/framework: ^11.0`
- `laravel/sanctum: ^4.0`
- `maatwebsite/excel: ^3.1`
- `barryvdh/laravel-dompdf: ^2.0`
- `spatie/laravel-permission: ^6.0`
- PSR-4 autoload entries for `App\\Domain\\` → `app/Domain/` and `App\\Infrastructure\\` → `app/Infrastructure/`

### 2. DDD Folder Structure

Create the following directories with a `.gitkeep` placeholder in each leaf:

```
app/Domain/Authors/Entities/
app/Domain/Authors/Repositories/
app/Domain/Authors/Services/
app/Domain/Books/Entities/
app/Domain/Books/Services/
app/Domain/Financial/
app/Application/Providers/
app/Application/Webhooks/
app/Infrastructure/Persistence/
app/Infrastructure/External/
```

### 3. Dual Database Configuration

Edit `config/database.php` to add a `woocommerce` connection alongside the default `mysql`:

```php
'woocommerce' => [
    'driver'    => 'mysql',
    'host'      => env('WC_DB_HOST', '127.0.0.1'),
    'port'      => env('WC_DB_PORT', '3306'),
    'database'  => env('WC_DB_DATABASE', 'wordpress'),
    'username'  => env('WC_DB_USERNAME', 'root'),
    'password'  => env('WC_DB_PASSWORD', ''),
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => env('WC_DB_PREFIX', 'wp_'),
    'strict'    => false,
    'engine'    => null,
],
```

### 4. Environment Files

Update `.env.example` to include all SUGAR and WooCommerce variables:

```
APP_NAME=SUGAR
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sugar
DB_USERNAME=root
DB_PASSWORD=

WC_DB_HOST=127.0.0.1
WC_DB_PORT=3306
WC_DB_DATABASE=wordpress
WC_DB_USERNAME=root
WC_DB_PASSWORD=
WC_DB_PREFIX=wp_
WC_ABANDONED_CART_TABLE=awc_abandoned_cart

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DRIVER=cookie
FILESYSTEM_DISK=local
```

Also create a `.env` file as a copy of `.env.example` for local development.

### 5. AppServiceProvider — UUID Primary Keys

In `app/Providers/AppServiceProvider.php`, inside the `boot()` method add:

```php
Model::shouldBeStrict(! app()->isProduction());
```

And ensure the `boot()` method imports `Illuminate\Database\Eloquent\Model`.

### 6. SecondaryDatabaseProvider

Create `app/Application/Providers/SecondaryDatabaseProvider.php`:

- Extends `Illuminate\Support\ServiceProvider`
- In `boot()`: attempts to verify the `woocommerce` DB connection is configured (checks that `WC_DB_DATABASE` env is set); logs a warning if not configured.
- Register it in `bootstrap/providers.php`.

### 7. CORS Configuration

In `config/cors.php`, set `allowed_origins` to include `http://localhost:5173` (Vite dev server) and ensure `supports_credentials` is `true` for Sanctum SPA auth.

### 8. Frontend — React 18 + TypeScript + Vite

Create the following frontend files inside `resources/js/`:

`resources/js/package.json` — place at project root as `package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "axios": "^1.6",
    "react": "^18.2",
    "react-dom": "^18.2",
    "react-router-dom": "^6.22",
    "@tanstack/react-query": "^5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2",
    "@types/react-dom": "^18.2",
    "@vitejs/plugin-react": "^4.2",
    "laravel-vite-plugin": "^1.0",
    "typescript": "^5.3",
    "vite": "^5.0"
  }
}
```

`vite.config.ts` at project root:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
  plugins: [
    laravel({ input: ['resources/js/main.tsx'], refresh: true }),
    react(),
  ],
  server: { host: 'localhost', port: 5173 },
})
```

`tsconfig.json` at project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["resources/js/*"] }
  },
  "include": ["resources/js/**/*", "vite.config.ts"]
}
```

`resources/js/main.tsx` — React entry point:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
```

`resources/js/App.tsx` — placeholder router shell:

```tsx
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>🍯 SUGAR — Bootstrap OK</div>} />
    </Routes>
  )
}
```

`resources/js/lib/axios.ts` — configured axios instance:

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
})

export default api
```

### 9. Blade Entry Point

Update `resources/views/welcome.blade.php` to serve as the SPA shell:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SUGAR</title>
  @viteReactRefresh
  @vite(['resources/js/main.tsx'])
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### 10. Routes

In `routes/web.php`, add a catch-all route that returns the SPA view:

```php
Route::get('/{any}', fn() => view('welcome'))->where('any', '.*');
```

In `routes/api.php`, add a health-check endpoint:

```php
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => 'SUGAR']));
```

## Important Notes

- Do NOT run any shell commands — only create/edit files.
- Ensure all PHP files have the correct `<?php` opening tag and `declare(strict_types=1);`.
- All new PHP classes must use proper namespaces matching the PSR-4 map.
- The `bootstrap/providers.php` array must include `App\Application\Providers\SecondaryDatabaseProvider::class`.

### Execution Plan (Status: Not Started)

[object Promise]

### Verification (Status: Not Started)