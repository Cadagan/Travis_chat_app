// Add Test

// Requirements
var expect = require("chai").expect;

// Add Test Start
console.log("[Add Test]: Starting Test");
describe("Add Test", function() {
    it("adds two numbers", function(done) {
        const add = (a, b) => a + b;
        const result = add(2, 2);
        const base = 4;
        expect(result).to.equal(base);
        done();
    });
});
// Completed
console.log("[Add Test]: Done!");
