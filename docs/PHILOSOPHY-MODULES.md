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
| Presentation | `components/philosophy-module/*` | Overview, tenet cards, critical perspectives, Apply & Reflect |
| Pages | `app/(app)/ethics/page.tsx`, `app/(app)/ethics/[tradition]/page.tsx` | `/ethics` lists traditions; `/ethics/<id>` shows one |

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

- Stored in the browser under `agora.reflections.v1`, one reflection per tenet (`userId` is `"local"`), up to 4,000 characters.
- Saved only on that device. Nothing is sent anywhere. The page never marks an answer right or wrong.
- When accounts arrive (Phase 3), the same `UserReflection` shape maps to a table with row-level security and `userId = auth.uid()`; `lib/reflections.ts` stays as it is and only the store changes.

## Not built yet (deferred by the specification)

Comparison with other ethical frameworks, guided scenarios beyond each tenet's example, accounts, sharing, AI-generated interpretations, community discussion, and personalisation.
