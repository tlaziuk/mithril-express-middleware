/* tslint:disable:max-classes-per-file object-literal-sort-keys */
import {
    expect,
} from "chai";

import {
    SinonSpy,
    spy,
} from "sinon";

import {
    mockReq,
    mockRes,
} from "sinon-express-mock";

import {
    Attributes,
    Component,
    RouteDefs,
    RouteResolver,
    Vnode,
} from "mithril";

import * as m from "mithril/render/hyperscript";

import middleware from "./index";

describe(middleware.name, () => {
    let view: Component<any, any>["view"] & SinonSpy;
    let onmatch: RouteResolver<any, any>["onmatch"] & SinonSpy;
    let render: RouteResolver<any, any>["render"] & SinonSpy;
    let resolver: RouteResolver<any, any>;
    let cmp: Component<any, any>;
    let routes: RouteDefs;
    beforeEach(() => {
        view = spy((vnode: Vnode<any, any>) => `test`);
        cmp = { view };
        onmatch = spy((attrs: Attributes, path: string) => cmp);
        render = spy((vnode: Vnode<any, any>) => vnode);
        resolver = { onmatch, render };
        routes = {
            "/": resolver,
            "/:test": resolver,
            "/:test...": resolver,
        };
    });
    it("should return RequestHandler function", () => {
        expect(middleware(routes)).to.be.a("function");
    });
    it("should be working with express res and req", async () => {
        const handler = middleware(routes);
        const res = mockRes();
        const req = mockReq({ path: "/" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(res.send.called).to.be.equal(true);
        expect(res.end.called).to.be.equal(true);
        expect(next.called).to.be.equal(false);
    });
    it("should be working with express next - non-existing route", async () => {
        const handler = middleware(routes);
        const res = mockRes();
        const req = mockReq({ path: "" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(res.send.called).to.be.equal(false);
        expect(res.end.called).to.be.equal(false);
        expect(next.called).to.be.equal(true);
    });
    it("should be working with express - default route", async () => {
        const handler = middleware(routes, { defaultRoute: "/" });
        const res = mockRes();
        const req = mockReq({ path: "" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(res.send.called).to.be.equal(true);
        expect(res.end.called).to.be.equal(true);
        expect(next.called).to.be.equal(false);
    });
    it("should be working with express - default attrs", async () => {
        const handler = middleware(routes, { attrs: { test: "test" } });
        const res = mockRes();
        const req = mockReq({ path: "/" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(onmatch.firstCall.args[0]).to.be.eql({ test: "test" });
        expect(render.firstCall.args[0].attrs).to.be.eql({ test: "test" });
        expect(view.firstCall.args[0].attrs).to.be.eql({ test: "test" });
    });
    it("should be working with express - request data as attrs", async () => {
        const handler = middleware(routes, {
            attrsBody: true,
            attrsCookies: true,
            attrsQuery: true,
        });
        const res = mockRes();
        const req = mockReq({
            body: { body: `test` },
            cookies: { cookies: `test` },
            query: { query: `test` },
            path: "/",
        });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(next.called).to.be.equal(false, `next was called, an exception was thrown`);
        expect(onmatch.firstCall.args[0]).to.be.eql({ body: "test", cookies: "test", query: "test" });
        expect(render.firstCall.args[0].attrs).to.be.eql({ body: "test", cookies: "test", query: "test" });
        expect(view.firstCall.args[0].attrs).to.be.eql({ body: "test", cookies: "test", query: "test" });
    });
    it("should be working with express - attrs overwrite request data", async () => {
        const handler = middleware(routes, {
            attrs: { body: `attrs` },
            attrsBody: true,
            attrsCookies: true,
            attrsQuery: true,
        });
        const res = mockRes();
        const req = mockReq({
            body: { body: `test` },
            cookies: { cookies: `test` },
            query: { query: `test` },
            path: "/",
        });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(next.called).to.be.equal(false, `next was called, an exception was thrown`);
        expect(onmatch.firstCall.args[0]).to.be.eql({ body: "attrs", cookies: "test", query: "test" });
        expect(render.firstCall.args[0].attrs).to.be.eql({ body: "attrs", cookies: "test", query: "test" });
        expect(view.firstCall.args[0].attrs).to.be.eql({ body: "attrs", cookies: "test", query: "test" });
    });
    it("should be working with express - route params", async () => {
        const handler = middleware(routes);
        const res = mockRes();
        const req = mockReq({ path: "/val" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(onmatch.firstCall.args[0]).to.be.eql({ test: "val" });
        expect(render.firstCall.args[0].attrs).to.be.eql({ test: "val" });
        expect(view.firstCall.args[0].attrs).to.be.eql({ test: "val" });
    });
    it("should be working with express - route variadic params", async () => {
        const handler = middleware(routes);
        const res = mockRes();
        const req = mockReq({ path: "/val/val" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(onmatch.firstCall.args[0]).to.be.eql({ test: "val/val" });
        expect(render.firstCall.args[0].attrs).to.be.eql({ test: "val/val" });
        expect(view.firstCall.args[0].attrs).to.be.eql({ test: "val/val" });
    });
    it("should be working with express - path params", async () => {
        const handler = middleware(routes);
        const res = mockRes();
        const req = mockReq({ path: "/?attr1=val#attr2=val" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(onmatch.firstCall.args[0]).to.be.eql({ attr1: "val", attr2: "val" });
        expect(render.firstCall.args[0].attrs).to.be.eql({ attr1: "val", attr2: "val" });
        expect(view.firstCall.args[0].attrs).to.be.eql({ attr1: "val", attr2: "val" });
    });
    it("should have working html function", async () => {
        const html = spy((partial: Promise<string>) => partial);
        const handler = middleware(routes, { html });
        const res = mockRes();
        const req = mockReq({ path: "/" });
        const next = spy();
        await handler(req as any, res as any, next as any);
        expect(html.calledOnce).to.be.equal(true);
        expect(html.firstCall.args[0]).to.be.instanceOf(Promise);
        expect(await html.firstCall.args[0]).to.be.a("string");
    });
});
