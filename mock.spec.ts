import {
    expect,
} from "chai";

import mock from "./mock";

describe(mock.name, () => {
    it("should mock window", () => {
        mock(global);
        expect(global).to.have.property("window");
    });
});
