// Log Test

// Requirements
var expect = require("chai").expect;

// Log Test Start
console.log("[Log Test]: Starting Test");
describe("Log Test", function() {
    it("provides a log", function(done) {
        expect("Log").to.be.equal("Log");
        done();
    });
});

// Completed
console.log("[Log Test]: Done!");
