import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


async function enableMocking() {
  console.log('Environment:', import.meta.env.VITE_ENVIRONMENT)
  if (import.meta.env.VITE_ENVIRONMENT !== 'development') {
    return
  }
 
  const { worker } = await import('./mocks/browser.ts')
 
  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})