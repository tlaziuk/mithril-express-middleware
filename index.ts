import {
    RequestHandler,
} from "express";
import {
    RouteDefs,
} from "mithril";

import router from "./router";

export type HtmlizeFunction = (partial: string | Promise<string>) => string | Promise<string>;

export interface IOptions {
    htmlize?: HtmlizeFunction;
    defaultRoute?: string;
}

export function mithrilExpressMiddleware(
    route: RouteDefs,
    {
        htmlize = (partial) => partial,
        defaultRoute,
    }: IOptions = {},
): RequestHandler {
    return async (req, res, next) => {
        try {
            res.send(await htmlize(router(route, req.path, defaultRoute))).end();
        } catch (e) {
            next();
        }
    };
}

export default mithrilExpressMiddleware;
