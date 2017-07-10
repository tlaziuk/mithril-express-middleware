// tslint:disable:ban-types

// code stolen from "mithril-node-renderer" and rewritten in TypeScript
// it would be great if this code could be merged into main package

import {
    Attributes,
    Children,
    ComponentTypes,
    Lifecycle,
    RouteResolver,
    Vnode,
} from "mithril";

import {
    isComponent,
} from "./render";

const VOID_TAGS = [
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    "!doctype",
];

const COMPONENT_PROPS = [
    "oninit",
    "view",
    "oncreate",
    "onbeforeupdate",
    "onupdate",
    "onbeforeremove",
    "onremove",
];

const isArray = Array.isArray;

function isObject(thing: any): thing is object {
    return typeof thing === "object";
}

function isFunction(thing: any): thing is Function {
    return typeof thing === "function";
}

function camelToDash(str: string) {
    return str
        .replace(/\W+/g, "-")
        .replace(/([a-z\d])([A-Z])/g, "$1-$2");
}

function removeEmpties(n: any) {
    return n !== "";
}

function omit(source: { [_: string]: any }, keys: string[] = []) {
    const res: typeof source = {};
    for (const k in source) {
        if (keys.indexOf(k) < 0) {
            res[k] = source[k];
        }
    }
    return res;
}

const copy = omit;

// shameless stolen from https://github.com/punkave/sanitize-html
function escapeHtml(s: any, replaceDoubleQuote?: boolean) {
    if (s === "undefined") {
        s = "";
    }
    if (typeof s !== "string") {
        s = s + "";
    }
    s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (replaceDoubleQuote) {
        return s.replace(/"/g, "&quot;");
    }
    return s;
}

async function setHooks(component: Lifecycle<any, any>, vnode: Vnode<Attributes, any>, hooks: Function[]) {
    if (component.oninit) {
        await component.oninit(vnode);
    }
    if (component.onremove) {
        hooks.push(component.onremove.bind(vnode.state, vnode));
    }
}

function createAttrString(view: Vnode<Attributes, any>, escapeAttributeValue: typeof escapeHtml = escapeHtml) {
    const attrs = view.attrs;

    if (!attrs || !Object.keys(attrs).length) {
        return "";
    }

    return Object.keys(attrs).map((name) => {
        const value = attrs[name];
        if (typeof value === "undefined" || value === null || typeof value === "function") {
            return;
        }
        if (typeof value === "boolean") {
            return value ? ` ${name}` : "";
        }
        if (name === "style") {
            if (!value) {
                return;
            }
            let styles = attrs.style;
            if (isObject(styles)) {
                styles = Object.keys(styles).map((property) => styles[property] !== "" ?
                    [camelToDash(property).toLowerCase(), styles[property]].join(":") :
                    "",
                ).filter(removeEmpties).join(";");
            }
            return styles !== "" ? ` style="${escapeAttributeValue(styles, true)}"` : "";
        }

        // Handle SVG <use> tags specially
        if (name === "href" && view.tag === "use") {
            return ` xlink:href="${escapeAttributeValue(value, true)}"`;
        }

        return ` ${(name === "className" ? "class" : name)}="${escapeAttributeValue(value, true)}"`;
    }).join("");
}

async function createChildrenContent(view: Vnode<Attributes, any>, options: { [_: string]: any }, hooks: Function[]) {
    if (view.text != null) {
        return options.escapeString(view.text);
    }
    if (isArray(view.children) && !view.children.length) {
        return "";
    }
    return await _render(view.children, options, hooks);
}

export async function mithrilRender(
    view: Children | ComponentTypes<any, any>,
    attrs: Attributes = {},
    options: { [_: string]: any } = attrs,
) {
    if (isComponent(view)) {
        // tslint:disable-next-line:whitespace
        view = await import("mithril").then((m) => m(view as any, attrs));
    } else {
        options = attrs || {};
    }
    const hooks: Function[] = [];

    options = {
        escapeAttributeValue: escapeHtml,
        escapeString: escapeHtml,
        strict: false,
        ...options,
    };

    const result = await _render(view, options, hooks);

    hooks.forEach((hook) => hook());

    return result;
}

async function _render(
    view: Children | ComponentTypes<any, any>,
    options: { [_: string]: any },
    hooks: Function[],
): Promise<string> {
    if (!view) {
        return "";
    }

    if (typeof view === "string") {
        return options.escapeString(view);
    }

    if (typeof view === "number" || typeof view === "boolean") {
        return view + "";
    }

    if (isArray(view)) {
        const res: Array<Promise<string>> = [];
        for (const v of view) {
            res.push(_render(v, options, hooks));
        }
        return (await Promise.all(res)).join("");
    }

    if (isComponent(view)) {
        // tslint:disable-next-line:whitespace
        view = await import("mithril").then((m) => m(view as any, options));
    }

    if (view.attrs) {
        await setHooks(view.attrs, view, hooks);
    }

    if (view.tag === "<") {
        return view.children + "";
    }
    const children = await _render(view.children, options, hooks);
    if (view.tag === "#") {
        return options.escapeString(children);
    }
    if (view.tag === "[") {
        return children;
    }
    if (typeof view.tag === "string") {
        if ((!children || !children.length) && (options.strict || VOID_TAGS.indexOf(view.tag.toLowerCase()) >= 0)) {
            // tslint:disable-next-line:max-line-length
            return `<${view.tag} ${createAttrString(view, options.escapeAttributeValue)} ${(options.strict ? "/" : "")}>`;
        }
        return [
            `<${view.tag} ${createAttrString(view, options.escapeAttributeValue)}>`,
            children,
            `</${view.tag}>`,
        ].join("");
    }
    return "";
}

export default mithrilRender;
