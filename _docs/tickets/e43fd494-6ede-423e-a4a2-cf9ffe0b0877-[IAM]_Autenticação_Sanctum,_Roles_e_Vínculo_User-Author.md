---
id: "e43fd494-6ede-423e-a4a2-cf9ffe0b0877"
title: "[IAM] Autenticação Sanctum, Roles e Vínculo User-Author"
assignee: ""
status: 0
createdAt: "2026-04-09T19:25:46.881Z"
updatedAt: "2026-04-09T19:25:57.834Z"
type: ticket
---

# [IAM] Autenticação Sanctum, Roles e Vínculo User-Author

## Objetivo

Implementar o domínio de identidade: autenticação via Sanctum SPA, recuperação de senha, sistema de roles (`admin` / `author`) e o vínculo entre `User` e `Author`.

## Tarefas

### 1. Migration: `users`

Adicionar à migration padrão do Laravel:

- `role` — enum `admin`, `author`, default `author`.
- `author_id` — UUID nullable, FK para `authors`.

### 2. Autenticação Sanctum

- Criar `AuthController` em `app/Http/Controllers/Auth/` com:
  - `POST /api/auth/login` — valida credenciais, emite cookie Sanctum.
  - `POST /api/auth/logout` — invalida sessão.
  - `GET /api/auth/me` — retorna usuário autenticado com role e author vinculado.
- Configurar `sanctum.stateful` com o domínio do frontend.

### 3. Recuperação de Senha

- Usar o sistema nativo do Laravel (`Password::sendResetLink`, `Password::reset`).
- Endpoints:
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`

### 4. Middleware de Role

- Criar middleware `EnsureRole` que verifica `auth()->user()->role`.
- Registrar como `role:admin` e `role:author` nas rotas.

### 5. Vínculo User-Author (Admin)

- Endpoint `PATCH /api/admin/users/{user}/link-author` — Admin vincula um `User` a um `Author` existente.
- Validação: um `Author` só pode estar vinculado a um `User` por vez.

### 6. Frontend — Telas de Auth

- Página de Login (`/login`) com formulário email + senha.
- Página de Forgot Password (`/forgot-password`).
- Página de Reset Password (`/reset-password?token=...`).
- Hook `useAuth()` com React Query para gerenciar estado de autenticação.
- Redirect automático baseado em role após login (`/admin` ou `/author`).

## Critérios de Aceite

Login retorna cookie Sanctum válido.Rota protegida por auth:sanctum retorna 401 sem cookie.Admin consegue vincular User a Author via API.Email de recuperação de senha é enviado corretamente.Middleware role:admin bloqueia acesso de usuários author.
