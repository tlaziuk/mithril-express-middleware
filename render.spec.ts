import {
    expect,
} from "chai";

import {
    mock,
} from "./mock";

import render from "./render";

mock(global);

describe(render.name, () => {
    it("should return Promise", () => {
        expect(render({ view: () => "div" })).to.be.instanceOf(Promise);
    });
    it("should resolve to string", async () => {
        expect(await render({ view: () => "div" })).to.be.a("string");
    });
});
