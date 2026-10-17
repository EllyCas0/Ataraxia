# The Agora

A space to explore philosophical perspectives, reflect on your own ideas, and keep a private journal.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No model installation, API keys, or environment variables are required.

All features use bundled content, browser storage, and local calculations. There are no external service integrations, API routes, or database connections.

## Features

- Browse one question library, with search and topics as filters.
- Search results include matching topics and related thinkers. Searches handle accents, punctuation, partial words of at least four characters, and a fixed vocabulary of Spanish topic translations. They do not provide general translation or spelling correction.
- Compare five thinkers using perspectives from the curated philosophy library.
- Explore comparison, Socratic, steelman, and historical views.
- Write a position, consider a reflection prompt, and revise it.
- Save reflections to your journal, search entries, and import or export backups.
- Choose your philosophical positions and add personal notes in your profile.
- Review English writing for claims, reasons, and language patterns.
- Enable optional ambient music using the speaker button.

Perspectives and reflection prompts use library content and local rules. The writing review uses English language patterns; it does not verify factual claims or provide a comprehensive assessment of an argument.

Journal entries, drafts, profile selections, and sound preferences are stored in the current browser. Export your journal and profile before clearing browser data or moving to another device.

## Validation

```bash
npm test
npm run lint
npm run build
```

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.
