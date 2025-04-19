import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error tracking
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Failed to start application</h1>
        <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
