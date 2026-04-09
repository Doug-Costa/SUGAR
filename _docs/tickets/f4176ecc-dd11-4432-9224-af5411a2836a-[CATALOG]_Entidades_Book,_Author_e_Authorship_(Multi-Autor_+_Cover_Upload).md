---
id: "f4176ecc-dd11-4432-9224-af5411a2836a"
title: "[CATALOG] Entidades Book, Author e Authorship (Multi-Autor + Cover Upload)"
assignee: ""
status: 0
createdAt: "2026-04-09T19:25:58.771Z"
updatedAt: "2026-04-09T19:26:12.076Z"
type: ticket
---

# [CATALOG] Entidades Book, Author e Authorship (Multi-Autor + Cover Upload)

## Objetivo

Implementar o domínio de catálogo: entidades `Author`, `Book` e a pivot `Authorship` com suporte a múltiplos autores, autor principal e upload de capa independente do WordPress.

## Tarefas

### 1. Migrations

- **`authors`**: `id` (UUID), `name`, `cpf` (unique), `bank_info` (JSON), `show_fee_detail` (bool, default false), `timestamps`.
- **`books`**: `id` (UUID), `title`, `isbn` (unique nullable), `cover_path` (nullable), `wc_product_id` (string nullable), `timestamps`.
- **`authorship`** (pivot): `book_id` (UUID FK), `author_id` (UUID FK), `royalty_percentage` (decimal 5,2), `is_main_author` (bool, default false), PK composta `(book_id, author_id)`.

### 2. Eloquent Models (Infrastructure/Persistence)

- `AuthorModel` — `$connection = 'mysql'`, casts para `bank_info` como array.
- `BookModel` — relação `belongsToMany(AuthorModel)` via `authorship` com pivots `royalty_percentage`, `is_main_author`.
- Validação de negócio: a soma de `royalty_percentage` de todos os autores de um livro deve ser ≤ 100%.

### 3. Domain Entities & Services

- `Author` entity em `app/Domain/Authors/Entities/`.
- `Book` entity em `app/Domain/Books/Entities/`.
- `Authorship` value object com validação de percentual.
- `BookService::attachAuthor(Book, Author, percentage, isMain)` — valida soma de percentuais antes de persistir.

### 4. Cover Upload

- Endpoint `POST /api/admin/books/{book}/cover` — aceita `image/jpeg`, `image/png`, máx 5MB.
- Armazena em `storage/app/public/covers/` (local) ou S3 (via `FILESYSTEM_DISK=s3`).
- Retorna URL pública via `Storage::url()`.

### 5. API CRUD

Endpoints (todos protegidos por `role:admin`, exceto GET que `author` também acessa):

- `GET/POST /api/admin/books`
- `GET/PUT/DELETE /api/admin/books/{book}`
- `POST /api/admin/books/{book}/authors` — adiciona autor ao livro.
- `DELETE /api/admin/books/{book}/authors/{author}` — remove autor do livro.
- `GET/POST /api/admin/authors`
- `GET/PUT/DELETE /api/admin/authors/{author}`

## Critérios de Aceite

Um livro pode ter múltiplos autores com percentuais distintos.Apenas um autor pode ter is_main_author = true por livro.Soma de royalty_percentage não ultrapassa 100% (validação na API).Upload de capa funciona e retorna URL acessível.Author com show_fee_detail = false não recebe fee_breakdown nas respostas de comissão.
