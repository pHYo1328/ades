import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
const instance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_BASE_URL}`,
});
export default instance;

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
