import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ArrowClockwise, Earth } from "@strapi/icons";
import { useLocation } from "react-router-dom";
import { unstable_useContentManagerContext as useContentManagerContext } from "@strapi/strapi/admin";
import { unstable_useDocumentActions as useDocumentActions } from "@strapi/strapi/admin";
import { getFetchClient } from "@strapi/strapi/admin";
import { Field } from "@strapi/design-system";
import PLUGIN_ID from "../pluginId";
import slugifyLib from "slugify";
interface Field {
  error?: string | boolean;
  hint?: React.ReactNode;
  id?: string;
  labelNode?: HTMLLabelElement;
  name?: string;
  required?: boolean;
  label?: string;
}
slugifyLib.extend({
  "ї": "yi",
  "й": "i",
  "є": "ie",
  "ґ": "g",
});

const slugify = (str: string, locale: string) =>
  slugifyLib(str, {
    lower: true,      // усе в нижній регістр
    strict: true,     // прибрати зайві символи, залишити a-z, 0-9 та «-»
    locale: locale,     // для російської можна "ru", а можна залишити "uk"
    trim: true,
  });

const SlugInput = (props: any) => {
  const { name, label, value, attribute, onChange } = props;
  const { id, contentType, model, form } = useContentManagerContext();
  const { initialValues, values: modifiedData } = form;
  const [currentLocale, setCurrentLocale] = useState<string>("");
  const [inputSlug, setInputSlug] = useState<string>(value || "");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reGenerate, setReGenerate] = useState<boolean>(false);

  const ensureLocaleInSlug = (slug: string) => {
    if (currentLocale && !slug.endsWith(`-${currentLocale}`)) {
      return `${slug}-${currentLocale}`;
    }
    return slug;
  };

  // @ts-ignore
  const uid: string = model;
  // need field
  const key: string = name;
  // @ts-ignore
  const pattern = contentType?.attributes[key]?.options?.pattern;
  // @ts-ignore
  const isTitleOrName =
    // @ts-ignore
    contentType?.attributes?.hasOwnProperty("title") ||
    // @ts-ignore
    contentType?.attributes?.hasOwnProperty("name");
  const isI18nEnabled: boolean =
    // @ts-ignore
    contentType?.attributes?.[name]?.pluginOptions?.i18n?.localized || false;

  useEffect(() => {
    if (!isTitleOrName) {
      setError(
        "Add a 'title' or 'name' field. required pattern (plugin advanced settings) missing for the plugin to work.",
      );
      setIsValid(false);
    }
  }, [isTitleOrName]);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    const locale = params?.get("plugins[i18n][locale]");
    setCurrentLocale(locale || "");
    onChange?.({ target: { name: "setLocale", value: locale } });
  }, [location]);
  key;

  useEffect(() => {
    if (initialValues?.[pattern] !== modifiedData?.[pattern]) {
      generateSlug();
    }
  }, [modifiedData?.[pattern]]);

  const validateSlug = async (slug: string) => {
    const { post } = getFetchClient();
    setIsLoading(true);

    try {
      const response = await post(
        `/${PLUGIN_ID}/check-slug?locale=${currentLocale}`,
        { id, slug, key, uid, currentLocale },
      );
      const data = response;
      const { isValid, message } = data?.data?.result;
      setIsLoading(false);
      if (!isValid) {
        setError(message);
        setIsValid(false);
        setReGenerate(true);
        return false;
      }
      setError(null);
      setIsValid(true);
      setInputSlug(ensureLocaleInSlug(modifiedData?.[pattern]));
      setReGenerate(false);
      return true;
    } catch (error) {
      setError("An error occurred while validating the slug.");
      setIsLoading(false);
      return false;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputSlug(newValue);
    setIsValid(null);

    if (!newValue?.trim() && attribute?.required) {
      setError("slug cannot be empty");
      setIsValid(false);
      setInputSlug("");
      onChange?.({ target: { name, value: "" } });
      return;
    }

    const isValid = await validateSlug(newValue);
    if (isValid) {
      onChange?.({ target: { name, value: ensureLocaleInSlug(newValue) } });
      setInputSlug(newValue);
      setTimeout(() => setIsValid(null), 3000);
    }
  };

  const generateSlug = () => {
    if (modifiedData?.[pattern]) {
      const newSlug = ensureLocaleInSlug(slugify(modifiedData?.[pattern], currentLocale));
      setInputSlug(newSlug);
      onChange?.({ target: { name, value: newSlug } });
      handleInputChange({ target: { value: newSlug } } as any);
    }
  };

  let counter = 1;
  const handleReGenerate = () => {
    const newSlug = ensureLocaleInSlug(
      slugify(modifiedData?.[pattern] + `-` + counter, currentLocale),
    );
    counter++;
    setInputSlug(newSlug);
    onChange?.({ target: { name, value: newSlug } });
    handleInputChange({ target: { value: newSlug } } as any);
    setReGenerate(false);
  };

  const clearSlug = () => {
    setInputSlug("");
    onChange?.({ target: { name, value: "" } });
  };

  return (
    <Field.Root
      label={name}
      required={attribute?.required}
      error={error}
      hint={
        <>
          Slug will be auto added based on the locale:
          <span
            style={{
              color: "#be5d01",
              fontWeight: "bold",
              padding: "0 5px",
              backgroundColor: "#f4f4f4",
              marginLeft: "3px",
            }}
          >
            -{currentLocale}
          </span>
        </>
      }
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        <Field.Label>{label}</Field.Label>
        {isI18nEnabled && (
          <Earth
            className="i18n-icon"
            aria-hidden="true"
            style={{
              marginLeft: "0.2rem",
            }}
            width="13px"
          />
        )}
      </span>
      <Field.Input
        name={name}
        value={value || inputSlug}
        onChange={handleInputChange}
        disabled
        aria-describedby={error ? `${name}-error` : undefined}
        endAction={
          <span>
            {isLoading ? (
              <StyledField>
                <span className="loading-icon-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width="1rem"
                    height="1rem"
                    fill="#f29d41"
                    className="loading-icon"
                  >
                    <path
                      fill="#f29d41"
                      d="M17.5 4v4a1.5 1.5 0 1 1-3 0V4a1.5 1.5 0 1 1 3 0m4.156 7.844a1.5 1.5 0 0 0 1.062-.44l2.828-2.829a1.503 1.503 0 1 0-2.125-2.125l-2.825 2.833a1.5 1.5 0 0 0 1.06 2.56M28 14.5h-4a1.5 1.5 0 1 0 0 3h4a1.5 1.5 0 1 0 0-3m-5.282 6.096a1.501 1.501 0 0 0-2.451 1.638c.075.182.186.348.326.487l2.828 2.829a1.503 1.503 0 0 0 2.125-2.125zM16 22.5a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 1 0 3 0v-4a1.5 1.5 0 0 0-1.5-1.5m-6.717-1.904-2.83 2.829A1.503 1.503 0 0 0 8.58 25.55l2.829-2.829a1.503 1.503 0 0 0-2.125-2.125M9.5 16A1.5 1.5 0 0 0 8 14.5H4a1.5 1.5 0 1 0 0 3h4A1.5 1.5 0 0 0 9.5 16m-.925-9.546A1.503 1.503 0 0 0 6.45 8.579l2.833 2.825a1.503 1.503 0 0 0 2.125-2.125z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              </StyledField>
            ) : isValid ? (
              <StyledField>
                <span className="available-icon-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="available-icon"
                  >
                    <path
                      fill="#008000"
                      fill-rule="evenodd"
                      d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Zm-1.438-11.066L16.158 7.5 18 9.245l-7.438 7.18-4.462-4.1 1.84-1.745 2.622 2.354Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Available
                </span>
              </StyledField>
            ) : (
              reGenerate && (
                <StyledField>
                  <ArrowClockwise onClick={handleReGenerate} />
                </StyledField>
              )
            )}
          </span>
        }
      />
      <Field.Hint>Ensure your slug is unique.</Field.Hint>
      {error && <Field.Error>{error}</Field.Error>}
    </Field.Root>
  );
};

export default SlugInput;

const StyledField = styled(Field.Root)`
  svg {
    height: 1rem;
    width: 1rem;
    path {
      fill: ${({ theme }) => theme.colors.neutral400};
    }
  }
  &:hover svg path {
    fill: ${({ theme }) => theme.colors.primary600};
  }

  span {
    font-size: 12px;
    margin-left: 0.5rem;
  }

  .field-label-icon {
    margin-right: 0.5rem;
  }

  .i18n-icon {
    svg {
      path:first-of-type {
        fill: ${({ theme }) => theme.colors.warning500};
      }
      path:last-of-type {
        fill: ${({ theme }) => theme.colors.warning500};
      }
    }
  }

  .loading-icon {
    path {
      fill: ${({ theme }) => theme.colors.warning500};
    }
    animation: fadeInOut 3s ease-in-out;
  }

  .available-icon {
    path {
      fill: ${({ theme }) => theme.colors.success500};
    }
  }

  .loading-icon-text,
  .available-icon-text {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: ${({ theme }) => theme.colors.warning500};
  }

  .available-icon-text {
    animation: fadeInOut 3s ease-in-out;
    color: ${({ theme }) => theme.colors.success500};
  }

  .loading-icon-text {
    animation: fadeInOut 3s ease-in-out;
    color: ${({ theme }) => theme.colors.warning500};
  }

  .loading-icon {
    path {
      fill: ${({ theme }) => theme.colors.warning500};
    }
    animation: spin 1s linear infinite;
  }

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
