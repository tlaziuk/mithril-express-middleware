import {
    expect,
} from "chai";

import {
    parsePath,
} from "./parse";

describe(parsePath.name, () => {
    it("should return string", () => {
        expect(parsePath("")).to.be.a("string");
    });
    it("should parse query");
    it("should parse hash");
    it("should return pathname", () => {
        expect(parsePath("")).to.be.equal("");
        expect(parsePath("/")).to.be.equal("/");
        expect(parsePath("/test")).to.be.equal("/test");
        expect(parsePath("/test?abc")).to.be.equal("/test");
        expect(parsePath("/test#abc")).to.be.equal("/test");
        expect(parsePath("/test?abc#abc")).to.be.equal("/test");
    });
});
