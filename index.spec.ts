/* tslint:disable:max-classes-per-file object-literal-sort-keys */
import {
    expect,
} from "chai";

import {
    RouteDefs,
} from "mithril";

import * as m from "mithril/render/hyperscript";

import middleware, {
    parsePath,
    render,
    router,
} from "./index";

describe(middleware.name, () => {
    const view = () => "";
    const defs = {
        "/": view,
        "/abc/test": view,
        "/:test...": view,
    } as RouteDefs;
    const paths = [
        "/",
        "/asd",
        "/abc",
        "/abc/test",
        "/test",
    ];
    class MockRes {
        public send(str: any) {
            expect(str).to.be.a("string");
            return this;
        }
        public end() {
            return this;
        }
    }
    class MockReq {
        constructor(public path: string) { }
    }
    const MockNext = () => () => undefined;
    it("should return RequestHandler function", () => {
        expect(middleware(defs)).to.be.a("function");
    });
    it("should returned RequestHandler require 3 arguments", () => {
        expect(middleware(defs)).to.have.property("length").equal(3);
    });
    it("should be working with express", () => {
        // @TODO add some spies
        const handler = middleware(defs);
        for (const path of paths) {
            const req = new MockReq(path);
            const res = new MockRes();
            const next = MockNext();
            handler(req as any, res as any, next as any);
        }
    });
    it("should have working html function", () => {
        const handler = middleware(defs, {
            html: (partial) => Promise.resolve(partial).then((val) => {
                expect(val).to.be.a("string");
                return val;
            }),
        });
        for (const path of paths) {
            const req = new MockReq(path);
            const res = new MockRes();
            const next = MockNext();
            handler(req as any, res as any, next as any);
        }
    });
});

describe(router.name, () => {
    const view = () => m("#", "test");
    const defs = {
        "/": {
            render: view,
        },
        "/abc/test": view,
        "/abc/:test": view,
        "/abc/:test...": view,
    } as RouteDefs;
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

describe(parsePath.name, () => {
    it("should return string", () => {
        expect(parsePath("")).to.be.a("string");
    });
    it("should parse params", () => {
        let query;
        let hash;

        query = {};
        hash = {};
        expect(parsePath("", query, hash)).to.be.a("string");
        expect(query).to.be.empty;
        expect(hash).to.be.empty;

        query = {};
        hash = {};
        expect(parsePath("/?test=test#test=test", query, hash)).to.be.a("string");
        expect(query).to.be.have.property("test").equal("test");
        expect(hash).to.be.have.property("test").equal("test");

        query = {};
        hash = {};
        expect(parsePath("/#test=test", query)).to.be.a("string");
        expect(query).to.be.have.property("test").equal("test");

        query = {};
        hash = {};
        expect(parsePath("/?test=test", query, hash)).to.be.a("string");
        expect(query).to.be.have.property("test").equal("test");
        expect(hash).to.be.empty;

        query = {};
        hash = {};
        expect(parsePath("/#test=test", query, hash)).to.be.a("string");
        expect(query).to.be.empty;
        expect(hash).to.be.have.property("test").equal("test");
    });
    it("should return pathname", () => {
        expect(parsePath("")).to.be.equal("");
        expect(parsePath("/")).to.be.equal("/");
        expect(parsePath("/test")).to.be.equal("/test");
        expect(parsePath("/test?abc")).to.be.equal("/test");
        expect(parsePath("/test#abc")).to.be.equal("/test");
        expect(parsePath("/test?abc#abc")).to.be.equal("/test");
    });
});

describe(render.name, () => {
    it("should return Promise", () => {
        expect(render({ view: () => "div" })).to.be.instanceOf(Promise);
    });
    it("should resolve to string", async () => {
        expect(await render({ view: () => "div" })).to.be.a("string");
    });
});
