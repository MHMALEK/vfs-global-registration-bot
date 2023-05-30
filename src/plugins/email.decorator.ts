import fp from "fastify-plugin";
const Mailjs = require("@cemalgnlts/mailjs");
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

export default fp<any>(async (fastify, opts) => {
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

  const login = async (mailjs: typeof Mailjs, username, password) => {
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

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    mailApi: {
      createEmail: any;
      getEmails: any;
      login: any;
      getEmailById: any;
    };
  }
}
