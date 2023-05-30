import fp from "fastify-plugin";
const cron = require("node-cron");

const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

export const findActivationLink = (text) => {
  //   console.log(text);
  const regex = /\[([^\]]+)\]/g;
  const matches = text.match(regex);
  let url;
  //   console.log("matches", matches);
  if (matches) {
    // Extract the URL from the first match (exclude the brackets)
    let firstMatch = matches[0];
    url = firstMatch.substring(1, firstMatch.length - 1); // This removes the brackets
    // console.log(url);
  } else {
    console.log("No matches found");
  }
  return url;
};

export default fp<any>(async (fastify, opts) => {
  const collection = fastify.mongo.client
    .db("vfs-appointments")
    .collection("users");

  const getAllUsersAndVerifyThem = async () => {
    return await collection.find({ isVerified: false }).toArray();
  };

  const createCronjob = () => {
    console.log("sads");
    let task = cron.schedule(
      "*/60 * * * * *",
      async () => {
        console.log("222");

        // console.log("asdsad");
        const usersThatIsNotVerified = await getAllUsersAndVerifyThem();
        // console.log(usersThatIsNotVerified);

        if (usersThatIsNotVerified.length === 0) {
          task.stop();
        } else {
          for (let i = 0; i < usersThatIsNotVerified.length; i++) {
            console.log(usersThatIsNotVerified[i].data.username);
            const { mails } = await fastify.mailApi.getEmails(
              usersThatIsNotVerified[i].data.username,
              usersThatIsNotVerified[i].data.password
            );

            console.log("2222", mails);

            if (mails.data[0]) {
              const id = mails.data[0].id;
              console.log(id);
              const vfsEmail = await fastify.mailApi.getEmailById(
                id,
                usersThatIsNotVerified[i].data.username,
                usersThatIsNotVerified[i].data.password
              );

              console.log("12312", vfsEmail.data.text);

              const verificationLinkFromEmail = findActivationLink(
                vfsEmail.data.text
              );
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
                  await collection.findOneAndUpdate(
                    {
                      "data.username": usersThatIsNotVerified[i].data.username,
                    }, // filter
                    { $set: { isVerified: true } } // update
                  );

                  await browser.close();
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        }
      },
      {
        scheduled: false, // This prevents the task from starting automatically
      }
    );

    // Start the cron job
    task.start();
  };

  //   createCronjob();

  fastify.decorate("emailVerifierCronJob", {
    // solve,
    createCronjob,
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    emailVerifierCronJob: {
      createCronjob: any;
    };
  }
}
