// Root Test
// Unit test that checks for 200 response in backend/app.js

// Requirements
console.log("[Root Test]: Loading Requirements");
var app = require("../backend-T0/app.js");
var request = require("supertest");

// Root test start
console.log("[Root Test]: Starting Test");
describe("Root Test", function() {
    // Description
    it("Looks for a working root.", function(done) {
        // Request
        console.log("[Root Test]: Requesting App");
        request(app)
            .get("/")
            .expect(200, done)
            // Error handling
            .end(function(err, res) {
                if (err) throw err;
                done();
            });
    });
});

// Completed
console.log("[Root Test]: Done!");
