/* tslint:disable:object-literal-sort-keys */
import {
    expect,
} from "chai";

import * as m from "mithril";

import router from "./router";

describe(router.name, () => {
    const view = () => m("#", "test");
    const defs = {
        "/": {
            render: view,
        },
        "/abc/test": view,
        "/abc/:test": view,
        "/abc/:test...": view,
    } as m.RouteDefs;
    it("should return Promise", () => {
        return expect(router(defs, "/")).to.be.instanceOf(Promise);
    });
    it("should resolve to string", async () => {
        expect(await router(defs, "/abc/test")).to.be.a("string");
    });
    it("should throw exception if route does not exists", async () => {
        let err;
        try {
            await router(defs, "not-exists");
        } catch (e) {
            err = e;
        }
        expect(err).to.be.instanceOf(Error);
    });
    it("should have working defaut route", async () => {
        expect(await router(defs, "not-exists", "/abc/abc")).to.be.a("string");
    });
});
