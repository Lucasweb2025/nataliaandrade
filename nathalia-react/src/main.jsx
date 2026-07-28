import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'

const phToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const phHost = import.meta.env.VITE_POSTHOG_HOST

if (phToken && phHost) {
  posthog.init(phToken, {
    api_host: phHost,
    defaults: '2026-05-30',
  })
} else if (import.meta.env.DEV) {
  console.error(
    'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured'
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}
