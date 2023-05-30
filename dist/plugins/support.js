"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
exports.default = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    fastify.decorate('someSupport', function () {
        return 'hugs';
    });
});
//# sourceMappingURL=support.js.map