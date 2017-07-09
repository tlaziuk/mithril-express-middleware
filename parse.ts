// tslint:disable-next-line:no-reference
/// <reference path="./types/mithril.d.ts" />

import * as parseQueryString from "mithril/querystring/parse";

// shamelessly stolen from mithril
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

export {
    parseQueryString,
};

export default parsePath;
