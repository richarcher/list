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

Add **translations** (English meanings) and **speakAs** (phonetic spellings for TTS so an English voice says them clearly):

```json
{
  "date": "2026-03-08",
  "title": "Week 8 (Afrikaans)",
  "lang": "af",
  "words": ["plakkaat", "kontak", ...],
  "translations": ["poster", "contact", ...],
  "speakAs": ["pluck-art", "kon-tuck", ...]
}
```

- **translations** – One English translation per word (shown in results and in the app).
- **speakAs** – Optional. One string per word: “sounds like” spelling for the English TTS voice. Omit or use `null` for a word to fall back to the real word.

Words can include a hyphen (e.g. `e-posadres`); the on-screen keyboard has a hyphen key.

---

## Parent TTS helper (Afrikaans)

For Afrikaans lists, the app has a **Parent: TTS helper** link on the list-picker screen. It opens a view where you can:

- Pick an Afrikaans list
- Edit the “Speak as” text for each word and **Play** to hear the English TTS
- When it sounds right, **Copy speakAs array** and paste it into `public/wordlists.json` as the `speakAs` array for that list

Use this to tune pronunciation when adding new Afrikaans words.

---

## Deployment

- **Build:** `npm run build` → output in `dist/`.
- **Deploy:** Pushing to **`main`** runs the GitHub Action: it builds, syncs `dist/` to S3, and invalidates the CloudFront cache. No manual deploy step.

Setup (S3, CloudFront, DNS, GitHub secrets, IAM) is described in **`docs/DEPLOYMENT.md`**.

---

## Stack

- **Vite** + **Vue 3**
- **Web Speech API** for text-to-speech (English voice; Afrikaans uses `speakAs` for pronunciation)
- **Static hosting:** S3 + CloudFront (HTTPS at list.richarcher.co.za)
