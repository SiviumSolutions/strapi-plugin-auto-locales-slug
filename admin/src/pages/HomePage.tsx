import { Main } from "@strapi/design-system";
import { useIntl } from "react-intl";
import { getTranslation } from "../utils/getTranslation";
import PLUGIN_ID from "src/pluginId";

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <h1>Welcome to {formatMessage({ id: getTranslation(PLUGIN_ID) })}</h1>
    </Main>
  );
};

export { HomePage };
