import { v2apibase } from "./base.js";
export const url = ({ id, endpoint, base = v2apibase }) => {
  let path = id === undefined ? `/${endpoint}/` : `/${endpoint}/${id}`;
  path = path.replace(/\/\//g, "/");
  return new URL(path, base);
};
