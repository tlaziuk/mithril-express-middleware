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
        {
            path,
            cookies,
            body,
            query,
        },
        {
            send,
        },
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
            send(
                await html(
                    routeRender(
                        routes,
                        path,
                        defaultRoute,
                        {
                            ...(attrsCookies && cookies ? cookies : {}),
                            ...(attrsBody && body ? body : {}),
                            ...(attrsQuery && query ? query : {}),
                            ...attrs,
                        },
                    ),
                ),
            ).end();
        } catch (e) {
            next(e);
        }
    };
}

export default mithrilExpressMiddleware;
