import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import './index.css'
//fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const config = {
  defaultPath: '/',
}

root.render(
  <HashRouter basename={config.defaultPath}>
    <App />
  </HashRouter>
);
