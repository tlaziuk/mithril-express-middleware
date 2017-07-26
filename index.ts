import {
    RequestHandler,
} from "express";

import {
    Attributes,
    RouteDefs,
} from "mithril";

import routeRender from "mithril-route-render";

export interface IOptions {
    html: (partial: Promise<string>) => Promise<string>;
    defaultRoute: string;
    attrs: Attributes;
}

export function mithrilExpressMiddleware(
    routes: RouteDefs,
    {
        html = (partial) => partial,
        defaultRoute,
        attrs = {},
    }: Partial<IOptions> = {},
): RequestHandler {
    return async (req, res, next) => {
        try {
            res.send(await html(routeRender(routes, req.path, defaultRoute, {
                ...attrs,
            }))).end();
        } catch (e) {
            next();
        }
    };
}

export default mithrilExpressMiddleware;
