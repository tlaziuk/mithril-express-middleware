/* tslint:disable:max-classes-per-file */
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
    } as RouteDefs;
    const paths = [
        "/",
        "/asd",
        "/abc",
        "/abc/test",
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
    function MockNext() { return () => undefined; }
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
    it("should have working htmlize function");
});
