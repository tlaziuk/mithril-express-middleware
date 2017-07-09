import {
    RequestHandler,
} from "express";
import {
    RouteDefs,
} from "mithril";

import router from "./router";

export type HtmlFunction = (partial: string | Promise<string>) => string | Promise<string>;

export interface IOptions {
    html?: HtmlFunction;
    defaultRoute?: string;
}

export function mithrilExpressMiddleware(
    route: RouteDefs,
    {
        html = (partial) => partial,
        defaultRoute,
    }: IOptions = {},
): RequestHandler {
    return async (req, res, next) => {
        try {
            res.send(await html(router(route, req.path, defaultRoute))).end();
        } catch (e) {
            next();
        }
    };
}

export default mithrilExpressMiddleware;
