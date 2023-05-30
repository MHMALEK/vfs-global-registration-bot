export declare const findActivationLink: (text: any) => any;
declare const _default: import("fastify").FastifyPluginAsync<any, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault, import("fastify").FastifyBaseLogger>;
export default _default;
declare module "fastify" {
    interface FastifyInstance {
        emailVerifierCronJob: {
            createCronjob: any;
        };
    }
}
