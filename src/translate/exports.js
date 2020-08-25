export * from "./loader.js";
export { get, register, translate } from "@npolar/mdc/src/translate/exports.js";
export { prefer, isNorwegian } from "@npolar/mdc/src/translate/language.js";

import { register } from "@npolar/mdc/src/translate/exports.js";
import { loader } from "./loader.js";

let empty = (key, config) =>
  key === undefined ? "" : `${key.split(".").pop().replace(/_/g, " ")}`;

const debug =
  window && window.location
    ? new URLSearchParams(window.location.search).has("debug")
    : false;
if (debug) {
  empty = (key, config) => `[${key}]!${config.lang}`;
}
const lookup = (key, config) => {
  if (undefined === key) {
    //console.warn("lookup key undefined");
    return "";
  }

  // Split the key in parts (example: hello.world)
  const parts = key.split(".");
  // Find the string by traversing through the strings matching the chain of keys
  let string = config.strings;
  // Shift through all of the parts of the key while matching with the strings.
  // Do not continue if the string is not defined or if we have traversed all of the key parts
  while (string != null && parts.length > 0) {
    string = string[parts.shift()];
  }
  // Make sure the string is in fact a string!
  return string != null ? string.toString() : null;
};
export const changeLang = (lang) => register(lang, { loader, empty, lookup });
// See https://github.com/andreasbm/lit-translate#-customize-advanced
