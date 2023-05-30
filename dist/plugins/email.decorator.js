"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const Mailjs = require("@cemalgnlts/mailjs");
exports.default = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const createNewInstance = () => {
        const mailjs = new Mailjs();
        return mailjs;
    };
    const createEmail = async () => {
        const mailjs = createNewInstance();
        const account = await mailjs.createOneAccount();
        console.log("createEmail", account);
        return account;
    };
    const getEmails = async (user, password) => {
        const mailjs = createNewInstance();
        const loginRes = await login(mailjs, user, password);
        const mails = await mailjs.getMessages();
        return { mails };
    };
    const getEmailById = async (id, user, password) => {
        const mailjs = createNewInstance();
        await login(mailjs, user, password);
        return await mailjs.getMessage(id);
    };
    const login = async (mailjs, username, password) => {
        const loginRes = await mailjs.login(username, password);
        return loginRes;
    };
    fastify.decorate("mailApi", {
        createEmail,
        getEmails,
        login,
        getEmailById,
    });
});
//# sourceMappingURL=email.decorator.js.map