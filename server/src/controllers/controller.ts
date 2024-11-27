import type { Core } from "@strapi/strapi";
import PLUGIN_ID from "../../../admin/src/pluginId";
const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async checkSlug(ctx: any) {
    try {
      const result = await strapi
        .plugin(PLUGIN_ID)
        .service("service")
        .checkSlug(ctx);
      ctx.body = { result };
    } catch (error) {
      //console.log("error", error);
      //ctx.throw(500, error.message || "Internal server error");
    }
  },
});

export default controller;
