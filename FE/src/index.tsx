import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const htmlRoot = document.getElementById('root') as HTMLElement;
const reactRoot = ReactDOM.createRoot(htmlRoot);
reactRoot.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
