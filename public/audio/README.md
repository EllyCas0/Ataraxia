# Background music

The music player (bottom-left of the app) plays the track named in `lib/music.ts`.

**Current track:** "Mirrorshade" (loop 1) by cinameng (James Gargette), `mirrorshade-1.mp3`, about 18 seconds, looped.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain dedication), so no permission or credit is required. Credit is given anyway.
- Source: https://opengameart.org/content/mirrorshade (downloaded unchanged; 717,844 bytes).

## Changing the track

1. Pick music you own or that is licensed for use on a public website. Check the licence on the track's own page: licences differ between tracks by the same artist, and a purchased or streamed copy of a commercial recording does not give you the right to publish it.
2. Put the file in this folder and update `TRACK` in `lib/music.ts` (title, artist, file name, licence, source URL).
3. Rebuild or restart the server, because the production server lists `public/` files when it starts.

Keep the file small (an MP3 under about 5 MB) so it loads quickly, and prefer a track that loops cleanly, since the player repeats it.

If the file is missing, pressing play shows "Audio file not found".
