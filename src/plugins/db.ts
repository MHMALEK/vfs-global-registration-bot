import fp from "fastify-plugin";
import mongodb from "@fastify/mongodb";

export default fp<any>(async (fastify) => {
  fastify.register(mongodb, {
    url: process.env.MONGO_DB_URL,
    name: "vfs-appointments",
  });
});
