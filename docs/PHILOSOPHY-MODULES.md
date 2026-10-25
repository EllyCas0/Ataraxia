# Philosophy modules (Natural Law first)

A self-contained learning module for one philosophical tradition. Natural Law is the first; others (Utilitarianism, Kantian ethics, Stoicism, and so on) plug into the same structure.

## Where things live

| Part | Location | Job |
|---|---|---|
| Content (plain data) | `lib/philosophy/natural-law.ts` | Tradition, ten tenets, thinkers, sources, critical perspectives |
| Data model | `lib/philosophy/types.ts` | `PhilosophyTradition`, `PhilosophyTenet`, `PhilosophySource`, `UserReflection`, and a few supporting types |
| Registry | `lib/philosophy/registry.ts` | The list of traditions, lookups by id and category |
| Validation | `lib/philosophy/validate.ts` | Finds empty fields and broken cross-references (run by the tests) |
| View models | `lib/philosophy/views.ts` | Looks up related concepts, thinkers and sources for the cards |
| User data | `lib/reflections.ts` (pure logic), `lib/reflections-store.ts` (browser storage) | Save, edit, delete reflections |
| Presentation | `components/philosophy-module/*` | Overview, tenet cards, critical perspectives |
| Pages | `app/(app)/ethics/page.tsx`, `app/(app)/ethics/[tradition]/[[...section]]/page.tsx` | `/ethics` lists traditions; `/ethics/<id>` shows one, and `/ethics/<id>/tenets` and `/perspectives` are its other sections |

Content, presentation and user data are kept apart: components never import `natural-law.ts`, and the content never knows about storage.

## Adding another tradition

1. Create `lib/philosophy/<name>.ts` that exports a `TraditionBundle` shaped like `naturalLawBundle`.
2. Add it to `bundles` in `lib/philosophy/registry.ts`.
3. Run `npm test`. `validateBundle` fails on any empty field, duplicate id, unknown source, thinker or concept.

That is all. The page, the cards, the reflection storage and the Ethics index pick it up automatically (a test in `tests/philosophy-module.test.ts` adds a made-up tradition to prove this). A new top-level category (for example "Metaphysics") would also need its own index page, like `/ethics`.

## Content rules

- The ten tenets are a **synthesized framework**, not an official list. Each carries a status (`classical`, `interpretation`, `contested`) that is always shown in words, and an `aquinasNote` wherever Aquinas's own claim differs from the broader framework.
- Cite passages so they can be checked. Avoid quoting wording that varies between translations.
- Present normative claims as claims, never as scientific facts. The tests reject phrases such as "it is proven" and "everyone agrees".
- **The text is a draft that needs review by someone with philosophical training before launch**, like the rest of the content library.

## Reflections

- Stored in the browser under `agora.reflections.v1` (the key keeps the app's old name so nobody's saved reflections are lost), one reflection per tenet (`userId` is `"local"`), up to 4,000 characters.
- Saved only on that device. Nothing is sent anywhere. The page never marks an answer right or wrong.
- When accounts arrive (Phase 3), the same `UserReflection` shape maps to a table with row-level security and `userId = auth.uid()`; `lib/reflections.ts` stays as it is and only the store changes.

## Not built yet (deferred by the specification)

Comparison with other ethical frameworks, guided scenarios beyond each tenet's example, accounts, sharing, AI-generated interpretations, community discussion, and personalisation.

## Addresses and 404s

- Every section has its own address: `/ethics/natural-law`, `/ethics/natural-law/tenets`, `/ethics/natural-law/perspectives`. Old links of the form `?section=tenets` redirect to them (see `next.config.ts`).
- The page lists its valid addresses in `generateStaticParams` (built from the registry) and sets `dynamicParams = false`, so an unknown tradition or section is a real HTTP 404. This is needed because the app has loading screens, which start streaming a "200 OK" response before a page can say it was not found. Adding a tradition to the registry adds its pages automatically.
- Each unknown address writes an `Internal: NoFallbackError` line to the server log. It is Next.js's own internal message for this setup and can be ignored.
- The same approach is used for `/ideas/[slug]` and `/insights/[slug]`. `/reflect/[id]` uses it only while conversations are the sample ones: remove it when conversations come from the database (see the comment in that file).

## Page structure (Natural Law)

Three sections: **Overview**, **Core Tenets**, **Critical Perspectives**. There is no longer a separate "Apply & Reflect" page: reflections are written and revisited on each tenet card (the card shows "Reflection saved" and its button changes to "Revisit reflection").

The Overview opens with the context, in this order: **Where it comes from** (the timeline), **Four ideas that are easy to mix up**, then **What is Natural Law?**, **How to read this module**, and **Major thinkers**.

Natural Law has its own item in the side and bottom navigation.
