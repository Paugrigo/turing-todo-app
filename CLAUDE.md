# To-Do App

A simple to-do list web app. First project for Turing College.

## Constraints

- **Plain HTML, CSS, and JavaScript only.** No frameworks (React, Vue, etc.), no libraries unless explicitly agreed, no TypeScript.
- **No build step.** No npm, bundlers, or transpilers. Files are served exactly as written.
- **No server, no database.** All data lives in the browser via `localStorage`.
- **Hosted on GitHub Pages.** The site must work as static files from the repo root, with `index.html` as the entry point. Use relative paths (`./style.css`, not `/style.css`) so it works under the `username.github.io/repo-name/` subpath.

## Structure

```
index.html   — markup and entry point
style.css    — all styles
script.js    — all app logic
```

Keep it to these three files unless the app grows enough to justify splitting.

## Features

Core:
- Add a task
- Mark a task as done / not done
- Mark done only via the checkbox (clicking the text does not toggle it)
- Edit a task by clicking its text (Enter or click away saves, Escape cancels; saving empty text deletes the task)
- Delete a task
- Tasks persist across page reloads

## Conventions

- Store tasks in `localStorage` as a JSON array under a single key (e.g. `todos`). Each task: `{ id, text, done }`.
- Wrap `localStorage` reads in `try/catch` and fall back to an empty list if data is missing or corrupt.
- Load `script.js` with `defer` (or at the end of `<body>`) so the DOM exists when it runs.
- Use `textContent`, not `innerHTML`, when rendering user-entered text.
- Use semantic HTML (`<form>`, `<button>`, `<ul>`, `<label>`) so the app is keyboard- and screen-reader-friendly.
- Make the layout work on mobile widths.

## Running locally

Open `index.html` directly in a browser, or run a simple static server:

```
python3 -m http.server
```

then visit http://localhost:8000.

## Deploying

Push to GitHub, then in the repo go to Settings → Pages → deploy from the `main` branch, root folder.
