import en from "./en.js";
import nn from "./nn.js";

// Lazy loading with ES2020 [dynamic import](https://v8.dev/features/dynamic-import):
// export const loader = async lang => {
//   const m = await import(`/text/${lang}.js`);
//   return m.default;
// };

export const loader = async (lang = "en") => {
  return lang === "nn" ? nn : en;
};
