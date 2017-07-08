import {
    expect,
} from "chai";

import * as m from "mithril";

import {
    mock,
} from "./mock";

import {
    isComponent,
    render,
} from "./render";

mock(global);

describe(isComponent.name, () => {
    it("should be a function", () => {
        expect(isComponent).to.be.a("function");
    });
    it("should return boolean", () => {
        expect(isComponent(() => undefined)).to.be.a("boolean");
        expect(isComponent(null)).to.be.a("boolean");
        expect(isComponent(undefined)).to.be.a("boolean");
        expect(isComponent({})).to.be.a("boolean");
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
