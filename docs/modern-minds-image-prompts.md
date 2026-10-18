# Modern Minds: image prompts

One image per daily-insight quote. Save each as `public/modern-minds/<slug>.jpg` (`.webp` and `.png` also work), then rebuild or restart the server. Until a file exists, `public/modern-minds/placeholder.svg` is shown and the "generated with AI" note is hidden. The slug is the file name.

## Specs

- **Shape:** portrait, 4:5 (for example 1200 x 1500 px). The home card crops to about 4:5 and the reading page crops to 4:3, so keep the face and shoulders in the middle of the frame.
- **Text space:** the quote sits over the bottom third of the card with a dark gradient. Keep that area simple (a wall, pavement or shadow), not a face or busy detail.
- **Look:** a single person, chest-up, looking slightly off camera or at the lens, in contemporary urban streetwear, shot on a city street at dusk. Muted, slightly desaturated colour (deep greens, charcoal, warm cream highlights) so it sits well on the app's dark green-black theme. No text, logos, signs or watermarks in the image.
- **Disclosure:** the card shows "Illustration generated with AI" whenever an image is present. Keep that true.
- **Likeness:** these are depictions of historical figures, so none of the portraits is a record of how they looked. Prefer a plausible imagined person over a "photo of Socrates".

## Shared style line (add to every prompt)

> Editorial portrait photograph, 4:5 vertical, chest-up, shallow depth of field, soft dusk light on a quiet city street, muted green and charcoal colour grade, subject centred in the upper two thirds, plain dark pavement or wall in the bottom third, no text, no logos, no watermark.

## Prompts

| Slug | Prompt (put the style line after it) |
|---|---|
| `socrates-unexamined-life` | An older, stocky Greek man with a broad nose, thick curly grey beard and a bald crown, wearing an oversized charcoal hoodie, a puffer vest and chunky sneakers, hands in pockets, a thoughtful half-smile as if mid-question. |
| `marcus-aurelius-dyed-by-thoughts` | A composed Roman man in his late fifties with short curled grey hair and a short beard, wearing a long black technical parka, a plain grey crew-neck and dark trousers, calm steady gaze, a leather notebook in one hand. |
| `epictetus-not-things` | A lean, weathered man of about sixty with a limp, leaning lightly on a plain walking stick, wearing a worn olive utility jacket, cargo trousers and a knit beanie, serene and unbothered expression. |
| `seneca-imagination` | A wealthy-looking, tired-eyed Roman man in his sixties with thinning hair, wearing a tailored camel overcoat over a black turtleneck, a scarf, holding a paper coffee cup, looking slightly past the camera. |
| `confucius-learning-and-thought` | An East Asian scholar in his late sixties with a long grey beard and a dignified, patient expression, wearing a deep-green bomber jacket, a high-collar shirt and clean white trainers, a book tucked under his arm. |
| `laozi-knowing-yourself` | A very old man with a long white beard and a gentle, amused face, wearing a loose cream oversized knit and wide-leg trousers, a tote bag over one shoulder, standing relaxed and still. |
| `aristotle-political-animal` | A Greek man in his fifties with a sharp, observant face, neat short beard and receding hair, wearing a navy varsity jacket, a white tee and tapered jeans, pointing as if explaining something to a small crowd just out of frame. |
| `mill-dissatisfied-socrates` | A thin, serious Victorian-era Englishman in his fifties with a high forehead and a trimmed grey beard, wearing a modern black wool coat, a grey scarf and wire-rimmed glasses, holding a folded newspaper. |

## Checking the result

After adding files, restart the server (or run a build) and open `/discover`. The quote of the day changes daily, so open `/insights/<slug>` to check each image directly.
