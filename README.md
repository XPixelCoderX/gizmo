# Gizmo Lab

A small, static science-experiment builder inspired by hands-on learning tools like Gizmos. It runs entirely in the browser and is ready to host with GitHub Pages—there is no build step, server, API key, or framework required.

## What’s here

- **Explore** three playable starter labs: pendulum motion, plant growth, and electric circuits.
- **Create experiments** by hand with a title, subject, learner level, description, directions, and an interactive model preset.
- **Create worksheets** with your own prompts, link them to an experiment, and answer them in the browser.
- Save experiments, observations, worksheet answers, and creations in the browser’s `localStorage`.
- Print learner worksheets from the worksheet reader.
- Responsive layout for desktop and mobile.

The AI/Gemini experiment and worksheet generation idea is intentionally **not connected yet**. This version makes no AI or network API requests; the “coming soon” card is only a placeholder. The model presets are safe, built-in interactions—not arbitrary HTML execution.

## Run locally

Open `index.html` in a browser, or serve the folder with any static file server. For example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Push or merge these files to the branch you want to publish.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing this site and choose **/(root)**, then save.

GitHub Pages will publish `index.html` directly. If you later connect Gemini, put API calls behind a small server or serverless function—do not publish a Gemini API key in browser JavaScript.

## Files

- `index.html` — app shell and creation dialogs
- `styles.css` — responsive styles and interactive-model artwork
- `app.js` — static app logic and built-in experiment data
