import { searchJSON } from "../../search.js";
import { v2apibase } from "../../base.js";
import { endpoint } from "./endpoint.js";

export const _search = new URL(
  `/${endpoint}/_search`.replace(/\/{2,}/g, "/"),
  v2apibase
);

export const findCaseNumberURL = (n) =>
  `${_search}?and=@id:${n}&type=feed&page=0..1`;

export const findCaseByNumber = async (n) => {
  const caseNumber = n;
  const url = findCaseNumberURL(caseNumber);
  return searchJSON({ url });
};

export const findID = async ({ name, area, ident }) => {
  const url = `${_search}?q=&and=name:${name}${
    area ? `,area:${area}` : ""
  }&page=0..1&type=feed`;
  const p = await searchJSON({ url });
  if (p) {
    return p.id;
  }
};

export const findCaseByUUID = async (uuid) =>
  searchJSON({ url: `${v2apibase}${endpoint}/${uuid}` });

export const findCaseByID = async (id) =>
  !Number.isInteger(id) && 36 === id.length
    ? findCaseByUUID(id)
    : findCaseByNumber(id);

export const findHighestCaseNumberURL = () =>
  `${_search}?sort=@id:desc&type=feed&page=0..1&show=@id`;

export const findHighestCaseNumber = async () => {
  const sak = await searchJSON({ url: findHighestCaseNumberURL() });
  return sak["@id"];
};
