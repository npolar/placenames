import { searchJSON } from "../../search.js";
import { v2apibase } from "../../base.js";
import { endpoint } from "./endpoint.js";

export const _search = new URL(
  `/${endpoint}/_search`.replace(/\/{2,}/g, "/"),
  v2apibase
);

// Minimal metadata
const defaultShow = "id,name,area,status,beginLifespanVersion,geometry";

export const findByCaseNumber = async (n) => {
  const caseNumber = n;
  const findCaseNumberURL = (n) =>
    `${_search}?and=@id:${n}&type=feed&page=0..1`;
  const url = findCaseNumberURL(caseNumber);
  return searchJSON({ url });
};

export const findID = async ({ name, area, ident }) => {
  const url = `${_search}?q=&and=name:${name}${
    area ? `,area:${area}` : ""
  }&page=0..1&type=feed`; // type feed and 1 object => JSON
  const p = await fetch(url).then((r) => r.json());
  if (p) {
    return p.id;
  }
};

export const fetchByIDs = async (ids) => {
  const or = ids.map((id) => `id:${id}`).join(",");
  const url = `${_search}?or=${or}`;
  const { results } = await searchJSON({ url });
  return results;
};

export const fetchByNames = async (
  names,
  { area, status = "official", show = defaultShow } = {}
) => {
  if (names === undefined || names.length < 1) {
    return [];
  }
  const or = names.map((name) => `name:${name}`).join(",");
  const url = `${_search}?or=${or}&and=status:${status}${
    area ? `&and=area:${area}` : ""
  }&page=..&show=${show}`;

  const { results } = await searchJSON({ url });
  return results;
};

export const findPlacenamesLinkingToCase = async (n) => {
  const url = new URL(
    `${_search}?and=cases.@id:${n}&show=id,name,area,status,beginLifespanVersion,geometry&page=..`
  );
  let { results, ...rest } = await searchJSON({ url });
  results = results.sort((a, b) => a.name.localeCompare(b.name));
  return { results, ...rest };
};

export const findPlacenamesUpdatedAfter = async ({
  datetime,
  area,
  show = defaultShow + ",_meta.modified",
}) => {
  const dt = new Date(datetime);
  const url = new URL(
    `${_search}?date-and=_meta.modified:${datetime}..&show=${show}&page=..&verbose=true`
  );
  if (area) {
    url.searchParams.append("and", `area:${area}`);
  }
  return searchJSON({ url });
};

// export const findNamesinArea = async ({ area }) => {
//   const url = new URL(
//     `${_search}?and=area:${area}&and=status:official&show=name&sort=name:asc&page=..`
//   );
//   let { results, ...rest } = await searchJSON({ url });
//   results = results.sort((a, b) => a.name.localeCompare(b.name));
//   return { results, ...rest };
// };
