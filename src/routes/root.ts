import { FastifyPluginAsync } from "fastify";

const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// (async () => {})();

const selectCaptchaImage = async (page) => {
  const encoding = "base64";
  const captchaScreenShotConfig = {
    encoding,
  };
  await page.waitForSelector("#CaptchaImage");
  const captchImage = await page.$("#CaptchaImage");
  const captchaImageBase64ScreenShot = await captchImage.screenshot(
    captchaScreenShotConfig
  );

  return captchaImageBase64ScreenShot;
};

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const collection = fastify.mongo.client
    .db("vfs-appointments")
    .collection("users");
  fastify.get("/", async function (request, reply) {
    const malek = await collection.insertOne({ name: "sssss" });
    return { root: malek };
  });

  fastify.get("/user", async function (request, reply) {
    const emailData = await fastify.mailApi.createEmail();
    const user = await collection.insertOne(emailData);

    return user;
  });

  fastify.get("/user/:id", async (request: any, response) => {
    const id = new fastify.mongo.ObjectId(request.params.id);
    const userData: any = await collection.findOne({
      _id: id,
    });

    const mails = await fastify.mailApi.getEmails(
      userData.username,
      userData.password
    );

    return { mails };
  });

  fastify.get("/create-account", async function name(req, res) {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto(
      "https://row7.vfsglobal.com/Global-Appointment/Account/RegisteredLogin?q=shSA0YnE4pLF9Xzwon/x/MI24mBrB3J1rBC1vdDKa5IQdrJXKYTs+DdVJBpH9l4l7y9kr9wkS1P1QdJpp0GPog=="
    );

    const createNewUserButton = "#NewUser";
    await page.waitForSelector(createNewUserButton);
    await page.click(createNewUserButton);

    const emailData = await fastify.mailApi.createEmail();

    const filedIds = [
      { id: "FirstName", value: "mohsen" },
      { id: "LastName", value: "newnameee" },
      { id: "validateEmailId", value: emailData.data.username },
      { id: "ContactNo", value: "9129999999" },
      { id: "Password", value: "74UKzg5oI!%8" },
      { id: "ConfirmPassword", value: "74UKzg5oI!%8" },
    ];

    await Promise.all(
      filedIds.map(({ id }) => {
        return page.waitForSelector(`#${id}`);
      })
    );

    for (let i = 0; i < filedIds.length; i++) {
      await page.type(`#${filedIds[i].id}`, filedIds[i].value);
    }

    page.on("dialog", async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept(); // or dialog.dismiss() if you want to dismiss
    });

    const termsAndConditonsAgreement = "#IsChecked";
    await page.click(termsAndConditonsAgreement);

    const captcha = selectCaptchaImage(page);

    const captchaResolvedText = await fastify.captchaSolver.solve(captcha);

    const captchTextSelector = "#CaptchaInputText";
    await page.type(captchTextSelector, captchaResolvedText);

    const submitButtonSelector =
      "#RegisterUserForm > div.frm-button > div > input:nth-child(3)";

    await page.click(submitButtonSelector);

    const user = await collection.insertOne({
      ...emailData,
      isVerified: false,
    });

    await fastify.emailVerifierCronJob.createCronjob();

    await browser.close();

    return { emailData, user };
  });
  fastify.get("/users/verified", async function (request, reply) {
    const usersWithVerifiedVfsAccount = await collection
      .find({ isVerified: true })
      .toArray();

    return usersWithVerifiedVfsAccount;
  });
};

export default root;
