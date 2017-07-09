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
