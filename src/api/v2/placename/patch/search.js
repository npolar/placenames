import { searchJSON } from "../../search.js";
import { v2apibase } from "../../base.js";
import { endpoint } from "./endpoint.js";

export const _search = new URL(
  `/${endpoint}/_search`.replace(/\/{2,}/g, "/"),
  v2apibase
);
