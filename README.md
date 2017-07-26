# mithril-express-middleware

[![Build Status](https://travis-ci.org/tlaziuk/mithril-express-middleware.svg?branch=master)](https://travis-ci.org/tlaziuk/mithril-express-middleware)
[![Coverage Status](https://coveralls.io/repos/github/tlaziuk/mithril-express-middleware/badge.svg?branch=master)](https://coveralls.io/github/tlaziuk/mithril-express-middleware?branch=master)
[![dependencies Status](https://david-dm.org/tlaziuk/mithril-express-middleware/status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware)
[![devDependencies Status](https://david-dm.org/tlaziuk/mithril-express-middleware/dev-status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware?type=dev)
[![peerDependencies Status](https://david-dm.org/tlaziuk/mithril-express-middleware/peer-status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware?type=peer)
[![npm version](https://badge.fury.io/js/mithril-express-middleware.svg)](https://badge.fury.io/js/mithril-express-middleware)
[![downloads](https://img.shields.io/npm/dm/mithril-express-middleware.svg)](https://www.npmjs.com/package/mithril-express-middleware)

use mithril routes with express

## installation

``` sh
npm install mithril-express-middleware
```

## usage

``` typescript
import mithrilExpress from "mithril-express-middleware";

import * as browserMock from "mithril/test-utils/browserMock";

// use a mock DOM so we can run mithril on the server
browserMock(global);

import app from "./your-express-app";
import routes from "./your-mithril-routes";

app.use(mithrilExpress(routes));
```

## see also

* [mithril.js](https://github.com/MithrilJS/mithril.js) to get know what is mithril
* [mithril-route-render](https://github.com/tlaziuk/mithril-route-render) to see what's behind the hood
