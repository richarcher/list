# List and Lys – Spelling Quiz

A small web app for practising spelling: pick a word list, hear each word (text-to-speech), type the spelling, and see your score. Built for learners (e.g. grade 4); supports English and Afrikaans word lists.

**Live:** [https://list.richarcher.co.za](https://list.richarcher.co.za)

---

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use **Preview** to test the production build:

```bash
npm run build
npm run preview
```

---

## Word lists

Lists live in **`public/wordlists.json`**: an array of list objects. Lists are shown in the app in date order.

### English list

```json
{
  "date": "2026-03-01",
  "title": "Week 7",
  "lang": "en",
  "words": ["excellent", "excited", "yesterday", ...]
}
```

- **date** – `YYYY-MM-DD`, used for ordering.
- **title** – Label in the dropdown (e.g. "Week 7").
- **lang** – `"en"` for English.
- **words** – Array of words to spell.

### Afrikaans list

Add **translations** (English meanings). For `lang: "af"` lists, the app will **speak the English translation** and the learner must **spell the Afrikaans word**:

```json
{
  "date": "2026-03-08",
  "title": "Week 8 (Afrikaans)",
  "lang": "af",
  "words": ["plakkaat", "kontak", ...],
  "translations": ["poster", "contact", ...]
}
```

- **translations** – One English translation per word (shown in results and in the app).

Words can include a hyphen (e.g. `e-posadres`); the on-screen keyboard has a hyphen key.



## Deployment

- **Build:** `npm run build` → output in `dist/`.
- **Deploy:** Pushing to **`main`** runs the GitHub Action: it builds, syncs `dist/` to S3, and invalidates the CloudFront cache. No manual deploy step.

Setup (S3, CloudFront, DNS, GitHub secrets, IAM) is described in **`docs/DEPLOYMENT.md`**.

---

## Stack

- **Vite** + **Vue 3**
- **Web Speech API** for text-to-speech (English prompt; Afrikaans lists are spelled in Afrikaans after listening to the English `translations`)
- **Static hosting:** S3 + CloudFront (HTTPS at list.richarcher.co.za)
