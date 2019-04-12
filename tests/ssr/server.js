import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './app';

const PORT   = 8081;
const app    = express();
const router = express.Router();

const serverRenderer = (req, res) => {
  fs.readFile(path.resolve('./index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    );
  });
};

router.use('^/$', serverRenderer);
app.use(router);
app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
