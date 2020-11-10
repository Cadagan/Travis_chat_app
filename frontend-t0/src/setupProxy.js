const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware("/auth/google", { target: "http://localhost:3002" }));
    app.use(createProxyMiddleware("/api/**", { target: "http://localhost:3002" }));
};