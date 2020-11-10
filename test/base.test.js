// Base Test

// Requirements
var expect = require("chai").expect;

// Base Test Start
console.log("[Base Test]: Starting Test");
describe("Base Test", function() {
    it("expects 1 to be equal to 1", function(done) {
        expect(1).to.be.equal(1);
        done();
    });
});

// Completed
console.log("[Base Test]: Done!");
