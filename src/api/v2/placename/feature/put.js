import { endpoint } from "./endpoint.js";
import { put as v2put } from "../../put.js";

export const put = async (payload, { host }) =>
  v2put(payload, { host, endpoint });
