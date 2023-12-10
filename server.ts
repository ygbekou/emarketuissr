// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import * as express from 'express';
import * as cookieparser from 'cookie-parser'; // Express server
import { join } from 'path';

import 'localstorage-polyfill';
import { Constants } from './src/app/app.constants';

global['localStorage'] = localStorage;

const domino = require('domino');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync('dist/browser/index.html').toString();
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;
global['DOMTokenList'] = win.DOMTokenList;
global['Node'] = win.Node;
global['Text'] = win.Text;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;
global['screen'] = win.screen;


// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server red
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');
const httpRequest = require('request');
const axios = require('axios');

// Express Engine
// import { ngExpressEngine } from '@nguniversal/express-engine';
// // Import module map for lazy loading
// import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine,
  provideModuleMap, REQUEST, RESPONSE } = require('./dist/server/main'); // Use the cookie parser

app.use(cookieparser());    // All regular routes use the Universal engine

app.engine('html', (_, options: any, callback) => {
  const engine = ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      { provide: 'request', useFactory: () => options.req, deps: [] },
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  });
  engine(_, options, callback);
});


app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

app.get('*', async (req, res) => {

  if (req.originalUrl.indexOf('products/dtl/') > -1) {
    console.log('USING SSR: ' + req.originalUrl);
    res.render(
      'index', {
      req, res, providers: [
        /// for cookie-parsing
        { provide: REQUEST, useValue: req },
        { provide: RESPONSE, useValue: res }
      ]
    },
      async (err, html) => {
        if (html) {
          console.log('HTML **** ' + req.originalUrl);

          let prdId, ptsId: number;
          if (req.originalUrl.indexOf('products/dtl/') > -1) {
            const params = req.originalUrl.split('/');
            prdId = params[params.length - 2];
            prdId = Number(prdId);
            ptsId = params[params.length - 1];
            ptsId = Number(ptsId);

            console.log('PARAM PTSID ******* ' + ptsId);
            if (!isNaN(ptsId) || Math.sign(ptsId) > 0) {

              await axios.get(Constants.apiServer + '/service/catalog/getProductOnSale/'
                + 2 + '/' + ptsId)
                .then((prd: any) => {
                  html = html.replace(/\$TITLE/g, prd.data.name);
                  html = html.replace(/\$DESCRIPTION/g, prd.data.description.replace(/(<([^>]+)>)/ig, ''));
                  // html = html.replace(/\$OG_META_KEYWORDS/g, respBody.metaKeywords);
                  // html = html.replace(/\$OG_META_DESCRIPTION/g, respBody.metaDescription);
                  html = html.replace(/\$OG_DESCRIPTION/g, prd.data.description.replace(/(<([^>]+)>)/ig, ''));
                  html = html.replace(/\$OG_URL/g, Constants.webServer + '/products/dtl/' + prdId + '/' + ptsId);
                  html = html.replace(/\$OG_TITLE/g, prd.data.name);
                  html = html.replace(/\$OG_IMAGE/g, Constants.webServer + '/assets/images/products/' + prdId
                    + '/' + prd.data.product.image);
                  html = html.replace(/\$OG_SITE/g, 'Kekouda');
                  html = html.replace(/\$OG_TYPE/g, 'Market Place');

                })
                .catch((error) => {
                  console.log(error);
                });

            }
          } else {
            console.log('Not Product Detail Page.');
          }

          res.send(html);
        }
      });
  } else {
    console.log('USING CSR: ' + req.originalUrl);
    res.sendFile(join(join(DIST_FOLDER, 'browser'), 'index.html'));
  }
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

