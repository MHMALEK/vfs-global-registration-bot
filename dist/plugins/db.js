"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const mongodb_1 = require("@fastify/mongodb");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(mongodb_1.default, {
        url: "mongodb+srv://mhosmalek:LV8Sduyf6g3fejCd@cluster0.vvvcesp.mongodb.net/",
        name: "vfs-appointments",
    });
});
//# sourceMappingURL=db.js.map