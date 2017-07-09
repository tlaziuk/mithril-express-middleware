mithril-express-middleware
===================
[![Build Status](https://travis-ci.org/tlaziuk/mithril-express-middleware.svg?branch=master)](https://travis-ci.org/tlaziuk/mithril-express-middleware)
[![dependencies Status](https://david-dm.org/tlaziuk/mithril-express-middleware/status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware)
[![devDependencies Status](https://david-dm.org/tlaziuk/mithril-express-middleware/dev-status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware?type=dev)
[![peerDependencies Status](https://david-dm.org/tlaziuk/mithril-express-middleware/peer-status.svg)](https://david-dm.org/tlaziuk/mithril-express-middleware?type=peer)

use mithril routes with express

**this package is still very unstable**

installation
------------

```
npm install mithril-express-middleware
```

usage
-----

```typescript
import mithrilExpress from "mithril-express-middleware";

// mock a window so we can run mithril on the server
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
