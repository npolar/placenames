import { endpoint } from "./endpoint.js";
import { get as v2get } from "../../get.js";
export const get = async ({ id, host }) => v2get({ id, endpoint, host });
