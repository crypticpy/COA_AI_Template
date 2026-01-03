import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App'

// Handle chunk load failures by auto-reloading once
window.addEventListener('error', (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.tagName === 'SCRIPT') {
    const reloadKey = 'chunk-reload-attempted';
    const hasReloaded = sessionStorage.getItem(reloadKey);
    
    if (!hasReloaded) {
      sessionStorage.setItem(reloadKey, 'true');
      console.warn('Script load failed, reloading page...');
      window.location.reload();
    }
  }
}, true);

// Handle unhandled promise rejections for dynamic imports
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  const errorMessage = error?.message || '';
  
  const isChunkError = (
    errorMessage.includes('Failed to fetch dynamically imported module') ||
    errorMessage.includes('Failed to load module script') ||
    errorMessage.includes('Loading chunk')
  ) && (
    errorMessage.includes('.js') ||
    errorMessage.includes('.mjs') ||
    errorMessage.includes('.css')
  );
  
  if (isChunkError) {
    const reloadKey = 'chunk-reload-attempted';
    const hasReloaded = sessionStorage.getItem(reloadKey);
    
    if (!hasReloaded) {
      sessionStorage.setItem(reloadKey, 'true');
      console.warn('Dynamic import failed, reloading page...');
      window.location.reload();
    }
  }
});

// Clear reload flag after successful load
setTimeout(() => {
  sessionStorage.removeItem('chunk-reload-attempted');
}, 5000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
