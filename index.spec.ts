/* tslint:disable:max-classes-per-file object-literal-sort-keys */
import {
    expect,
} from "chai";

import {
    RouteDefs,
} from "mithril";

import index from "./index";

describe(index.name, () => {
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
        expect(index(defs)).to.be.a("function");
    });
    it("should returned RequestHandler require 3 arguments", () => {
        expect(index(defs)).to.have.property("length").equal(3);
    });
    it("should be working with express", () => {
        // @TODO add some spies
        const handler = index(defs);
        for (const path of paths) {
            const req = new MockReq(path);
            const res = new MockRes();
            const next = MockNext();
            handler(req as any, res as any, next as any);
        }
    });
    it("should have working html function", () => {
        const handler = index(defs, {
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
