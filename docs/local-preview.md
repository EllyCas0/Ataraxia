# Local preview

Run `npm run preview` to compile the app and serve the production build at
http://localhost:3000. The initial build takes time; opening pages afterward
does not trigger development compilation. Stop an existing server on port 3000
before starting the preview.

After a successful build, `npm start` reuses that build. Run `npm run preview`
again after changing source files to include those changes.

Use `npm run dev` when editing the app. It uses Turbopack and supports live
updates, but the first visit to each route may take longer while it compiles.

If Next.js reports Windows `Access is denied` while loading its configuration,
run it in a terminal with access to the project directory. A restricted runner
can prevent the native compiler from resolving the workspace path.
