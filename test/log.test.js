// Log Test

// Requirements
var expect = require('chai').expect;

// Log Test Start
console.log("[Log Test]: Starting Test");
describe("Log Test", function() {
    it("provides a log", function(done) {
        expect(1).to.be.equal(1);
    });
});

// Completed
console.log("[Log Test]: Done!");