// tslint:disable-next-line:no-reference
/// <reference path="./types/mithril-node-render.d.ts" />

import {
    Attributes,
    Children,
    ComponentTypes,
    Lifecycle,
    RouteResolver,
    Vnode,
} from "mithril";

import mithrilRender from "./renderer";

export type Defs = ComponentTypes<any, any> | RouteResolver<any, any>;

export function isComponent(thing: any): thing is ComponentTypes<Attributes, Lifecycle<Attributes, object>> {
    return !!(thing && (thing.view || typeof thing === "function"));
}

export async function render(
    payload: Defs,
    params: { [_: string]: any } = {},
    path: string = "",
): Promise<string> {
    if (isComponent(payload)) {
        return await mithrilRender(payload, params);
    } else {
        // tslint:disable-next-line:whitespace
        const m = await import("mithril");
        let component: Vnode<any, any>;
        if (payload.onmatch) {
            component = m(await payload.onmatch(params, path), params);
        } else {
            component = m("div");
        }
        if (payload.render) {
            return await mithrilRender(payload.render(component), params);
        }
    }
    return "";
}

export default render;
