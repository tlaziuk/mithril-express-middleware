mithril-express-middleware
===================
[![Build Status](https://travis-ci.org/tlaziuk/mithril-express-middleware.svg?branch=master)](https://travis-ci.org/tlaziuk/mithril-express-middleware)
[![Dependency Status](https://david-dm.org/tlaziuk/mithril-express-middleware.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware)
[![devDependency Status](https://david-dm.org/tlaziuk/mithril-express-middleware/dev-status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware#info=devDependencies)

use mithril routes with express

installation
------------

```
npm install mithril-express-middleware
```

usage
-----

```typescript
import mithrilExpress from "mithril-express-middleware";

// use a mock window so we can run mithril on the server
import mock from "mithril-express-middleware/mock";

import app from "./your-express-app";
import routes from "./your-mithril-routes";

mock();

app.use(mithrilExpress(routes));
```

see also
--------

* [mithril-node-render](https://github.com/MithrilJS/mithril-node-render) to see what is behind the hood
* [mithril.js](https://github.com/MithrilJS/mithril.js) to get know what is mithril
