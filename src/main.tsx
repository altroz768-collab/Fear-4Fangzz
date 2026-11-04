import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <FirebaseAuthProvider>
        <App />
      </FirebaseAuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

