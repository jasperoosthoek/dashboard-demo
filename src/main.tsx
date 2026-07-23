import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles.scss';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

async function main() {
  if (__USE_MOCKS__) {
    // Paired with sw.js's skipWaiting()/clients.claim(): if a new deploy's
    // worker takes control of an already-open tab mid-session, reload once
    // rather than continuing to run old JS against a new worker (or vice
    // versa). Registered before worker.start() so it can't miss the event.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    const { worker } = await import('../mocks/browser');
    await worker.start({
      serviceWorker: {
        url: '/sw.js',
      },
    });
  }

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}

main();
