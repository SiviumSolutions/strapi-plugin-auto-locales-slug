import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async checkSlug(ctx: any) {
    try {
      const { slug, uid, key, currentLocale, id } = ctx.request.body;
      const whereCondition: any = {
        [key]: slug,
        locale: currentLocale,
      };
      if (id) {
        whereCondition.id = {
          $ne: id,
        };
      }

      const existingEntry = await strapi.db?.query(uid).findOne({
        where: whereCondition,
      });

      return {
        isValid: !existingEntry,
        message: existingEntry ? "slug is already taken" : "slug is available",
      };
    } catch (error) {
      // console.log("error", error);
      // throw new Error("Internal server error");
    }
  },
});
