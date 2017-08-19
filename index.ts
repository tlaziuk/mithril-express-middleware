import {
    RequestHandler,
} from "express";

import {
    Attributes,
    RouteDefs,
} from "mithril";

import routeRender from "mithril-route-render";

export interface IOptions {
    attrs: Attributes;
    attrsBody: boolean;
    attrsCookies: boolean;
    attrsQuery: boolean;
    defaultRoute: string;
    html: (partial: Promise<string>) => Promise<string>;
    [_: string]: any;
}

export function mithrilExpressMiddleware(
    routes: RouteDefs,
    opt: Partial<IOptions> = {},
): RequestHandler {
    return async (
        req,
        res,
        next,
    ) => {
        const {
            attrsCookies = false,
            attrs = {},
            attrsBody = false,
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

export default mithrilExpressMiddleware;
