// tslint:disable-next-line:no-reference
/// <reference path="./types/mithril.d.ts" />

import {
    RequestHandler,
} from "express";

import {
    RouteDefs,
} from "mithril";

import render from "./render";

import * as parseQueryString from "mithril/querystring/parse";

// code from mithril.js internal method
export function parsePath(
    path: string,
    queryData?: { [_: string]: any },
    hashData: typeof queryData = queryData,
): string {
    const queryIndex = path.indexOf("?");
    const hashIndex = path.indexOf("#");
    const pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length;
    if ((queryIndex > -1) && (typeof queryData !== "undefined")) {
        const queryEnd = hashIndex > -1 ? hashIndex : path.length;
        const queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd));
        // tslint:disable-next-line:forin
        for (const key in queryParams) {
            queryData[key] = queryParams[key];
        }
    }
    if ((hashIndex > -1) && (typeof hashData !== "undefined")) {
        const hashParams = parseQueryString(path.slice(hashIndex + 1));
        // tslint:disable-next-line:forin
        for (const key in hashParams) {
            hashData[key] = hashParams[key];
        }
    }
    return path.slice(0, pathEnd);
}

export async function router(
    routes: RouteDefs,
    path: string,
    defaultPath: string = path,
): Promise<string> {
    const params: { [_: string]: any } = {};
    const pathname = parsePath(path, params, params);
    // tslint:disable-next-line:forin
    for (const route in routes) {
        const matcher = new RegExp(
            `^${route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)")}\/?$`,
        );
        const matchArr = pathname.match(matcher);
        if (matchArr !== null) {
            const keys = route.match(/:[^\/]+/g) || [];
            const [match, ...values] = matchArr;
            // tslint:disable-next-line:forin
            for (const i in keys) {
                const key = keys[i];
                const value = values[i];
                params[key.replace(/:|\./g, "")] = decodeURIComponent(value);
            }
            return await render(routes[route], params, path);
        }
    }
    if (path !== defaultPath) {
        return await router(routes, defaultPath);
    }
    throw new Error(`Could not resolve route '${path}'`);
}

export interface IOptions {
    html: (partial: string | Promise<string>) => string | Promise<string>;
    defaultRoute: string;
}

export function mithrilExpressMiddleware(
    route: RouteDefs,
    {
        html = (partial) => partial,
        defaultRoute,
    }: Partial<IOptions> = {},
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
