export default [
  {
    method: "POST",
    path: "/check-slug",
    handler: "controller.checkSlug",
    config: {
      policies: [],
      // middlewares: ["plugin::slug.slug", "plugin::slug.autoSlug"],
    },
  },
];
