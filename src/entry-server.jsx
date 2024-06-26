import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App';

export function render(path) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <Provider store={store}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </Provider>
    </React.StrictMode>,
  );
  return { html };
}
