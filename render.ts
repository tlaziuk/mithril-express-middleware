// tslint:disable-next-line:no-reference
/// <reference path="./types/mithril.d.ts" />

import {
    Attributes,
    Children,
    ClassComponent,
    Component,
    ComponentTypes,
    CVnode,
    FactoryComponent,
    Lifecycle,
    RouteResolver,
    Vnode,
} from "mithril";

import mithrilRender, {
    isComponentType,
} from "mithril-render";

export type Defs = ComponentTypes<any, any> | RouteResolver<any, any>;

export async function render(
    payload: Defs,
    params: { [_: string]: any } = {},
    path: string = "",
): Promise<string> {
    // tslint:disable-next-line:whitespace
    const m = await import("mithril/render/hyperscript");
    if (isComponentType(payload)) {
        return await mithrilRender(m(payload, params));
    } else {
        let component: Vnode<any, any>;
        if (payload.onmatch) {
            component = m(await payload.onmatch(params, path), params);
        } else {
            component = m("div");
        }
        if (payload.render) {
            return await mithrilRender(payload.render(component));
        }
    }
    return "";
}

export default render;
