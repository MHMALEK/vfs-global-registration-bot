import fp from "fastify-plugin";

const captchClient = require("@infosimples/node_two_captcha");

export default fp<any>(async (fastify, opts) => {
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

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    captchaSolver: {
      solve: any;
    };
  }
}
