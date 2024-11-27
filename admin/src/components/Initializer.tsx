import { useEffect, useRef } from "react";
import PLUGIN_ID from "src/pluginId";

type InitializerProps = {
  setPlugin: (id: string) => void;
};

const Initializer = ({ setPlugin }: InitializerProps) => {
  const ref = useRef(setPlugin);

  useEffect(() => {
    ref.current("auto-locales-slug");
  }, []);

  return null;
};

export { Initializer };
