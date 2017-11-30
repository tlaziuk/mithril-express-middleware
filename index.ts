import {
    RequestHandler,
} from "express";

import {
    Attributes,
    RouteDefs,
} from "mithril";

import routeRender from "mithril-route-render";

export interface IOptions {
    /** Attributes to pass to the route */
    attrs: Attributes;
    /** pass req.body to Attributes */
    attrsBody: boolean;
    /** pass req.cookies to Attributes */
    attrsCookies: boolean;
    /** pass req.query to Attributes */
    attrsQuery: boolean;
    /** default route when nothig is matched */
    defaultRoute: string;
    /** function parse resulting html */
    html: (partial: Promise<string>) => Promise<string>;
    [_: string]: any;
}

export default function mithrilExpressMiddleware(
    routes: RouteDefs,
    opt: Partial<IOptions> = {},
): RequestHandler {
    return async (
        req,
        res,
        next,
    ) => {
        const {
            attrs = {},
            attrsBody = false,
            attrsCookies = false,
            attrsQuery = false,
            defaultRoute,
            html = (partial: Promise<string>) => partial,
        } = opt;
        try {
            const doc = await html(
                routeRender(
                    routes,
                    req.path,
                    defaultRoute,
                    {
                        ...(attrsCookies && req.cookies ? req.cookies : {}),
                        ...(attrsBody && req.body ? req.body : {}),
                        ...(attrsQuery && req.query ? req.query : {}),
                        ...attrs,
                    },
                ),
            );
            res.send(
                doc,
            ).end();
        } catch (e) {
            next(e);
        }
    };
}
