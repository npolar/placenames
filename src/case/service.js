import { first } from "../first.js";

export const img = (year, n) => `/namnekomite/sak/png/${n}.png`;
export const hasPNG = (n) => Number(n) < 345;

// @todo use store.keys()
const MAX = 410;

export const caseStream = async ({ area } = {}) => {
  if (area !== undefined) {
    console.log({ area });
    return caseStore.filterIndex("area", area);
  } else {
    return caseStore.all();
  }
};

//search({ sort: "date:desc,@id:desc", page: ".." })

//   seek(id, (m, id) => +m["number"] === +id, storedMeetings());
//export const seek = async (needle, criteria, inAsyncIterator) => {

// export const get = async (id, { offline = true } = {}) =>
//   offline
//     ? caseStore.get(id)
//     : first([caseStore.get(id) /*, GET(id, {endpoint})*/]);
export const get = () => console.error("get()");

export const max = async () => first([MAX]); // sort desc nr 1
// export const max = async id =>
//     seek(id, (c, id) => +c["@id"] === +id, storedCases());

import { base } from "./base.js";
export { base };
export const href = (sak) =>
  `${base}/${Number(sak) === sak ? sak : sak["@id"]}`;
export const text = (c) => `${c["@id"]} – ${c.title}`;
export const text1 = (c) => c.title;
export const text2 = (c) => `${c["@id"]} (${c.date})`;

export const path = href;
