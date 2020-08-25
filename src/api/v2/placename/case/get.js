import { endpoint } from "./endpoint.js";
import { get as v2get } from "../../get.js";
import { findCaseByID } from "./search.js";

export const get = async ({ id, host }) => v2get({ id, endpoint, host });

//const base = `${v2apibase}${endpoint}`;
//export const get = async (id) => fetch(`${base}/${id}`).then((r) => r.json());

export const getCaseByNumber = async (number, { host } = {}) => {
  const { id } = await findCaseByID(number);
  return get({ id, host });
};
