import {
    Attributes,
    RouteDefs,
} from "mithril";

import {
    parsePath,
} from "./parse";

import render from "./render";

export async function router(routes: RouteDefs, path: string, defaultPath: string = path): Promise<string> {
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

export default router;
