# The Agora: architecture plan (Phase 1)

This app replaces the earlier "Agora" app in this repository. The old code and PRD remain in git history (last Agora commit: `e1d8aa3`) and the PRD is archived in `docs/archive/`.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript). `proxy.ts` replaces `middleware.ts` in this version. |
| UI | Tailwind CSS v4 + shadcn/ui (Radix base), system font stacks (no build-time font downloads) |
| Auth + DB | Supabase Auth and Postgres, accessed with the **user's session** so Row Level Security applies |
| AI | OpenAI SDK, called only from server code (route handlers) |
| Search | Postgres full-text search (`tsvector` + GIN index). No vector database yet. |
| Validation | Zod, for every request body and for structured model output |
| Tests | Vitest (unit, plus migrations/RLS/search against PGlite), Playwright (end to end, system Chrome) |

## Layout

```
app/
  (auth)/            login, signup, forgot/reset password, auth callback   (public)
  (app)/             app shell: sidebar (desktop) / bottom bar (mobile)
    discover/        daily question, themes, featured ideas, weekly card   (public read)
    ideas/           searchable library + /ideas/[slug]                    (public read)
    weekly/          Human Perspective                                      (public read, save needs login)
    reflect/         conversations list, /new, /[id]                        (login required)
    my-philosophy/   journal, saved insights, values, history               (login required)
  api/chat/          authenticated, rate-limited, streaming chat endpoint
lib/
  content/           typed seed content: questions, concepts, weekly prompts, values
  supabase/          browser, server, and proxy clients
  ai/                provider interface, OpenAI adapter, prompt builder, safety checks
  data/              repositories (thin wrappers over Supabase queries, Zod-parsed)
supabase/
  migrations/        versioned SQL (schema, RLS, indexes, search)
  seed.sql           GENERATED from lib/content (a test fails if it drifts)
proxy.ts             refreshes the Supabase session cookie on each request
```

## Data and security model

- **Public content** (`daily_questions`, `philosophy_concepts`, `weekly_prompts`) is readable by anyone, but only rows with `publication_status = 'approved'`. Nothing public is writable from the client.
- **Private data** (`profiles`, `conversations`, `messages`, `journal_entries`, `saved_items`, `user_values`) has RLS `user_id = auth.uid()` on every operation. `messages` is authorized through its parent conversation.
- Identity always comes from the session (`supabase.auth.getUser()`), never from a client-supplied id. Server code checks ownership too, in addition to RLS.
- `messages.role` is constrained in the database to `user` and `assistant`. A client can never supply a `system` message.
- The service-role key is not used by request handlers. The OpenAI key is read only on the server.
- Logs never contain journal text or message bodies. Analytics events carry no free text.

## Chat request flow

1. Authenticate (session) 2. Zod-validate body and length 3. per-user rate limit 4. load the conversation (RLS) 5. safety screen on the user message 6. retrieve up to N approved concepts via full-text search 7. build instructions: system prompt + mode + retrieved records, labeled as reference material, not instructions 8. call the model with a recent-message window (plus stored summary) 9. stream tokens to the client 10. persist the completed exchange 11. return friendly errors only.

## Daily and weekly selection

Both are deterministic. The daily question uses the configured `APP_TIMEZONE`: a row whose `active_date` equals today wins, otherwise a stable rotation (`dayNumber mod count`, over approved questions sorted by slug) is used. The weekly prompt works the same way keyed by the Monday of the week. A page refresh never changes either.

## What can and cannot be verified in this environment

| Area | How it is verified here | Needs your credentials |
|---|---|---|
| UI, navigation, content, daily/weekly logic | Vitest + Playwright | no |
| Migrations, RLS policies, full-text search | Vitest against PGlite (real Postgres compiled to WASM), with the Supabase `auth` helpers emulated | no |
| Chat endpoint logic, prompt building, safety, rate limits | Vitest with a mock model | no |
| Real sign-up/sign-in, email delivery, password reset | **Not testable here** (no Supabase project, no Docker) | Supabase project |
| Real model responses and streaming | **Not testable here** | OpenAI API key and model name |

Nothing in the last two rows is claimed as working until it has been run against real credentials.

## Phases

1. Plan (this document).
2. App shell, design system, responsive pages on seeded demo data.
3. Supabase auth, migrations, RLS.
4. AI chat backend, system prompt, persistence, errors.
5. Knowledge base and retrieval.
6. Journal, saved insights, values, weekly prompts, onboarding.
7. Tests, security checks, accessibility, deployment docs.
