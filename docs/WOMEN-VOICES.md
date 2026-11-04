# Women's voices timeline

The home page ends with a sideways-scrolling timeline of women thinkers (`lib/content/women-voices.ts`,
`components/content/women-timeline.tsx`). Rules for adding to it:

- **Only checkable quotes.** Each quote must trace to a public-domain text or translation, and the source is shown on
  the card. If it cannot be traced to the person, leave it out. Hypatia has no quote on purpose: nothing of hers survives,
  and the well-known "reserve your right to think" line first appears in Elbert Hubbard's 1908 book.
- **Say what is uncertain.** Diotima is known only through Plato's *Symposium* (Jowett translation); the card says so.
  Sor Juana's lines are translated for Stoa, with the Spanish shown, so no one mistakes it for a published translation.
- **Time order.** Keep `womenVoices` sorted by `start` (a unit test checks it). Negative years are BCE.
- **Public domain only.** A unit test keeps quoted people to those who started before 1900. For later thinkers (Arendt,
  Weil, de Beauvoir, Midgley) use short quotes only after checking licensing, or paraphrase and link.

## How each quote was checked (November 2026)
| Person | Source checked |
| --- | --- |
| Sappho | Fragment 130, Wharton (Wikiquote listing of the 1887 edition) |
| Diotima | Jowett, *Symposium*, Project Gutenberg #1600 |
| Julian of Norwich | *Revelations of Divine Love* (Wikiquote) |
| Mary Astell | *Some Reflections upon Marriage*, 1700 (Wikiquote, citing Springborg) |
| Olympe de Gouges | Declaration of the Rights of Woman, article 1 (Wikiquote) |
| Mary Wollstonecraft | *Vindication*, ch. 4 (Wikiquote) |
| Margaret Fuller | *Woman in the Nineteenth Century* (Wikiquote) |
| Anna Julia Cooper | *A Voice from the South*, p. 298 (Wikiquote) |
| Sor Juana | First line of "Hombres necios", c. 1689 (well known; English by Stoa) |

Most were checked against Wikiquote rather than the original page, so a human reviewer should compare each against the
original text before launch.

## Gaps to fill
Mostly European and American so far. Candidates with public-domain sources to check next: Hildegard of Bingen,
Christine de Pizan, Ban Zhao, Rabia al-Adawiyya, Gargi Vachaknavi, Mirabai.
