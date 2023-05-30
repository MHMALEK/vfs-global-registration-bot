"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findActivationLink = void 0;
const fastify_plugin_1 = require("fastify-plugin");
const cron = require("node-cron");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const findActivationLink = (text) => {
    const regex = /\[([^\]]+)\]/g;
    const matches = text.match(regex);
    let url;
    if (matches) {
        let firstMatch = matches[0];
        url = firstMatch.substring(1, firstMatch.length - 1);
    }
    else {
        console.log("No matches found");
    }
    return url;
};
exports.findActivationLink = findActivationLink;
exports.default = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    const collection = fastify.mongo.client
        .db("vfs-appointments")
        .collection("users");
    const getAllUsersAndVerifyThem = async () => {
        return await collection.find({ isVerified: false }).toArray();
    };
    const createCronjob = () => {
        console.log("sads");
        let task = cron.schedule("*/60 * * * * *", async () => {
            console.log("222");
            const usersThatIsNotVerified = await getAllUsersAndVerifyThem();
            if (usersThatIsNotVerified.length === 0) {
                task.stop();
            }
            else {
                for (let i = 0; i < usersThatIsNotVerified.length; i++) {
                    console.log(usersThatIsNotVerified[i].data.username);
                    const { mails } = await fastify.mailApi.getEmails(usersThatIsNotVerified[i].data.username, usersThatIsNotVerified[i].data.password);
                    console.log("2222", mails);
                    if (mails.data[0]) {
                        const id = mails.data[0].id;
                        console.log(id);
                        const vfsEmail = await fastify.mailApi.getEmailById(id, usersThatIsNotVerified[i].data.username, usersThatIsNotVerified[i].data.password);
                        console.log("12312", vfsEmail.data.text);
                        const verificationLinkFromEmail = (0, exports.findActivationLink)(vfsEmail.data.text);
                        console.log("asdasd", verificationLinkFromEmail);
                        if (verificationLinkFromEmail) {
                            try {
                                const browser = await puppeteer.launch({
                                    headless: false,
                                });
                                const page = await browser.newPage();
                                await page.goto(verificationLinkFromEmail);
                                console.log("222222", usersThatIsNotVerified[i]);
                                const malekTwo = await collection.findOne({ _id: id });
                                const malekOne = await collection.findOne({
                                    "data.username": usersThatIsNotVerified[i].data.username,
                                });
                                console.log("asdasdasdasdasdasdasdsad", malekOne);
                                await collection.findOneAndUpdate({
                                    "data.username": usersThatIsNotVerified[i].data.username,
                                }, { $set: { isVerified: true } });
                                await browser.close();
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
            }
        }, {
            scheduled: false,
        });
        task.start();
    };
    fastify.decorate("emailVerifierCronJob", {
        createCronjob,
    });
});
//# sourceMappingURL=email-cronjob.js.map