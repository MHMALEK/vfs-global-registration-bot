import fp from "fastify-plugin";
import mongodb from "@fastify/mongodb";

export default fp<any>(async (fastify) => {
  fastify.register(mongodb, {
    url: "mongodb+srv://mhosmalek:LV8Sduyf6g3fejCd@cluster0.vvvcesp.mongodb.net/",
    name: "vfs-appointments",
  });
});
