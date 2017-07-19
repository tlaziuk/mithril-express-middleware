import {
    expect,
} from "chai";

import render from "./render";

describe(render.name, () => {
    it("should return Promise", () => {
        expect(render({ view: () => "div" })).to.be.instanceOf(Promise);
    });
    it("should resolve to string", async () => {
        expect(await render({ view: () => "div" })).to.be.a("string");
    });
});
