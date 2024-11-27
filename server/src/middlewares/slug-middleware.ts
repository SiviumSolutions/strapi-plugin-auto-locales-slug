// export default ({ strapi }: { strapi: any }) => {
//   return async (ctx: any, next: any) => {
//     if (ctx.request.method === "POST") {
//       const locale = ctx.request.body?.currentLocale;
//       if (locale && ctx.request.body?.data) {
//         ctx.context = {
//           ...ctx.context,
//           locale,
//         };

//         const model = strapi.getModel(ctx.request.url.split("/")[1]);
//         const slugFields = Object.entries(model.attributes)
//           .filter(
//             ([_, attr]: any) =>
//               attr.customField === "plugin::slug.slug",
//           )
//           .map(([key]) => key);
//         slugFields.forEach((field) => {
//           if (ctx.request.body.data[field]) {
//             const currentSlug = ctx.request.body.data[field];
//             if (!currentSlug.endsWith(`-${locale}`)) {
//               ctx.request.body.data[field] = `${currentSlug}-${locale}`;
//             }
//           }
//         });
//       }
//     }

//     if (ctx.request.method === "PUT") {
//       const locale = ctx.query?.locale || ctx.request.body?.currentLocale;
//       if (locale && ctx.request.body?.data) {
//         ctx.context = {
//           ...ctx.context,
//           locale,
//         };

//         const model = strapi.getModel(ctx.request.url.split("/")[1]);
//         const slugFields = Object.entries(model.attributes)
//           .filter(
//             ([_, attr]: any) =>
//               attr.customField === "plugin::slug.slug",
//           )
//           .map(([key]) => key);

//         slugFields.forEach((field) => {
//           if (ctx.request.body.data[field]) {
//             const currentSlug = ctx.request.body.data[field];
//             const baseSlug = currentSlug.replace(/-[a-z]{2}(-[A-Z]{2})?$/, "");
//             ctx.request.body.data[field] = `${baseSlug}-${locale}`;
//           }
//         });
//       }
//     }

//     await next();
//   };
// };
