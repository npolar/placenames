import { v2apibase } from "../../base.js";
import { endpoint } from "./endpoint.js";
import { findCaseByID } from "./search.js";

const base = `${v2apibase}${endpoint}`;
export const get = async (id) => fetch(`${base}/${id}`).then((r) => r.json());

export const getCaseByNumber = async (number) => {
  const { id } = await findCaseByID(number);
  return get(id);
};
