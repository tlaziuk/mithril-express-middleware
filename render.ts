// tslint:disable-next-line:no-reference
/// <reference path="./types/mithril-node-render.d.ts" />

import * as mithrilNodeRender from "mithril-node-render";

import {
    ComponentTypes,
    RouteResolver,
    Vnode,
} from "mithril";

export type Defs = ComponentTypes<any, any> | RouteResolver<any, any>;

export function isComponent(thing: any): thing is ComponentTypes<any, any> {
    return !!(thing && (thing.view || typeof thing === "function"));
}

export async function render(
    payload: Defs,
    params: { [_: string]: any } = {},
    path: string = "",
): Promise<string> {
    if (isComponent(payload)) {
        return await mithrilNodeRender(payload);
    } else {
        const m = await import ("mithril");
        let component: Vnode<any, any>;
        if (payload.onmatch) {
            component = m(await payload.onmatch(params, path), params);
        } else {
            component = m("div");
        }
        if (payload.render) {
            return await mithrilNodeRender(payload.render(component));
        }
    }
    return "";
}

export default render;
