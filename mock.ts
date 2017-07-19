// tslint:disable-next-line:no-reference
/// <reference path="types/mithril.d.ts" />

import * as browserMock from "mithril/test-utils/browserMock";

export function mock(env: object = global) {
    browserMock(env);
}

export default mock;
