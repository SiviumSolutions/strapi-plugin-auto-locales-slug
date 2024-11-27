import { getTranslation } from "./utils/getTranslation";
import { Initializer } from "./components/Initializer";
import { PluginIcon } from "./components/PluginIcon";
import PLUGIN_ID from "./pluginId";

export default {
  register(app: any) {
    app.customFields.register({
      name: PLUGIN_ID,
      icon: PluginIcon,
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: `${PLUGIN_ID}.label`,
        defaultMessage: "Auto Locales Slug",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.description`,
        defaultMessage: "Auto generate slug field based on locales",
      },

      components: {
        Input: async () => import("./components/input"),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.form.pattern`,
              defaultMessage: "Must Required Field",
            },
            items: [
              {
                intlLabel: {
                  id: `${PLUGIN_ID}.form.pattern.label`,
                  defaultMessage: "Pattern",
                },
                name: "options.pattern",
                type: "select",
                options: [
                  {
                    key: "title",
                    value: "title",
                    metadatas: {
                      intlLabel: {
                        id: `${PLUGIN_ID}.form.pattern.title`,
                        defaultMessage: "title",
                      },
                    },
                  },
                  {
                    key: "name",
                    value: "name",
                    metadatas: {
                      intlLabel: {
                        id: `${PLUGIN_ID}.form.pattern.name`,
                        defaultMessage: "name",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.form.advanced`,
              defaultMessage: "Advanced Settings",
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: `${PLUGIN_ID}.form.required.label`,
                  defaultMessage: "Required field",
                },
                description: {
                  id: `${PLUGIN_ID}.form.required.description`,
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
                defaultValue: true,
              },
            ],
          },
        ],
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: getTranslation(data),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return importedTranslations;
  },
};
