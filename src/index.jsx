import React from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js';
import App from './components/App';
import './demo.css';

hljs.initHighlightingOnLoad();

ReactDOM.render(
  <App />,
  document.getElementById('mount')
);
