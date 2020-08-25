// All of the imports below are created with: ./bin/fetch-official-placenames
import sv from "./sv.js";
import dml from "./dml.js";
import jm from "./jm.js";
import bv from "./bv.js";
import p1 from "./p1.js";

export { officialNameMapsFrozenDatetime } from "./frozen-datetime.js";
// Last "updated" in API v1: "2020-06-11T13:12:34Z";

const aq = [...dml, ...bv, ...p1];
const northern = [...sv, ...jm];

const map = new Map([
  ["Svalbard", sv],
  ["Jan Mayen", jm],
  ["Antarktis", aq],
  ["Dronning Maud Land", dml],
  ["Bouvetøya", bv],
  ["Peter I Øy", p1],
]);

export const officialInAreaMap = (area) =>
  area && map.has(area)
    ? new Map(map.get(area).map((area) => [area]))
    : new Map([]);

export const officalWithSpaceInArea = (area) =>
  area && map.has(area) ? map.get(area).filter((name) => /\s/.test(name)) : [];
