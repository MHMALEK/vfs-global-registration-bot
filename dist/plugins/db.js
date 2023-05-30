"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const mongodb_1 = require("@fastify/mongodb");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(mongodb_1.default, {
        url: process.env.MONGO_DB_URL,
        name: "vfs-appointments",
    });
});
//# sourceMappingURL=db.js.map