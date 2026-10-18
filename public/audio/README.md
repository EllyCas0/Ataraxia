# Background music

The music player (bottom-left of the app) plays `drone-logic.mp3` from this folder.

**The audio file is not included.** "Drone Logic" by Daniel Avery is a commercial recording. To use it you need permission to publish it on your site (a licence from the rights holders). Buying or streaming a copy for personal listening does not give you that right. If you don't have it, use music you own or that is licensed for this use, such as a royalty-free track.

To change the track, edit `lib/music.ts` (title, artist, file name) and put the new file here. Rebuild or restart the server after adding the file, because the production server lists `public/` files when it starts.

Until a file is present, pressing play shows "Audio file not found".
