<script setup>
defineProps({
  lang: { type: String, default: 'en' },
  voicesAvailable: { type: Boolean, default: true }
})
</script>

<template>
  <div v-if="lang === 'af' && !voicesAvailable" class="voice-help" role="region" aria-labelledby="voice-help-heading">
    <h2 id="voice-help-heading" class="voice-help-heading">No Afrikaans voice detected</h2>
    <p class="voice-help-intro">Your device may not have an Afrikaans voice installed. To hear words pronounced correctly, add an Afrikaans voice:</p>
    <ul class="voice-help-steps">
      <li><strong>Windows:</strong> Settings → Time &amp; language → Speech → Add a language / Manage voices</li>
      <li><strong>macOS:</strong> System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → add Afrikaans</li>
      <li><strong>Android:</strong> Settings → Language &amp; input → Text-to-speech (or “Speech”) → install/add Afrikaans</li>
      <li><strong>iOS:</strong> Settings → Accessibility → Spoken Content → Voices → add Afrikaans</li>
    </ul>
    <p class="voice-help-note">You can still start the quiz; the browser may use another voice.</p>
  </div>
</template>

<style scoped>
.voice-help {
  width: 100%;
  max-width: 28rem;
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 8px;
  text-align: left;
}
.voice-help-heading {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-h, #08060d);
}
.voice-help-intro {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text, #6b6375);
  line-height: 1.4;
}
.voice-help-steps {
  margin: 0 0 0.5rem;
  padding-left: 1.25rem;
  font-size: 0.85rem;
  color: var(--text, #6b6375);
  line-height: 1.5;
}
.voice-help-steps li {
  margin-bottom: 0.25rem;
}
.voice-help-note {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text, #6b6375);
  font-style: italic;
}
</style>
