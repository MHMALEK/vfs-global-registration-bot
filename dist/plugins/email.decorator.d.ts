export interface SupportPluginOptions {
}
declare const _default: import("fastify").FastifyPluginAsync<any, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault, import("fastify").FastifyBaseLogger>;
export default _default;
declare module "fastify" {
    interface FastifyInstance {
        mailApi: {
            createEmail: any;
            getEmails: any;
            login: any;
            getEmailById: any;
        };
    }
}
