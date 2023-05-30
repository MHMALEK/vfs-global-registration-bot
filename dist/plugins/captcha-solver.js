"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const captchClient = require("@infosimples/node_two_captcha");
exports.default = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const captchResolver = new captchClient("0e819916b2290052cd066c68014a4282", {
        timeout: 60000,
        polling: 5000,
        throwErrors: false,
    });
    const solve = async (base64captcha) => {
        const res = await captchResolver.decode({
            base64: base64captcha,
        });
        return res.text;
    };
    fastify.decorate("captchaSolver", {
        solve,
    });
});
//# sourceMappingURL=captcha-solver.js.map