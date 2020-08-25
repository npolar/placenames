// @crit import { placenameStore } from "./store.js";
// import { refStore } from "../ref/store.js";
// import { caseStore } from "../case/store.js";
import dupSV from "./by-area/dup/sv-dup.js";
import dupDML from "./by-area/dup/dml-dup.js";
//import { search as placenameAPISearch, get as fetchPlacename } from "./api.js";
import { first } from "../first.js";
import { SV, DML } from "../vocab/area.js";
import { decode as decodeArea } from "../vocab/area.js";
import { decode } from "./params.js";

//export { get } from "./get.js";
//export { search } from "../api/v1.js";
export { decode, encode, extractParams } from "./params.js";

// const { fromEntries } = Object;
// const { isInteger } = Number;
//export const isUUID = nameOrID => false;

export const idbkey = (p) => {
  const noSufAreas = [SV, "Arktis", "Antarktis", undefined];
  const suf =
    p.area === p.name || noSufAreas.includes(p.area)
      ? ""
      : `/${p.area ? p.area[0] : "u"}`;
  const key = `${p.name}${suf}`.toLowerCase();
  return key;
};

//const special = /(\s|_|\/|'\+)/g;

// encode / or decode path depends on context hmm

export const text = (p) => p.name;

// export const search = ({q, filters=[]}={}) => {
//     const r = await searchPlacenameAPI1(q, { filters });
// }

// export const placenameDuplicateStream = async () =>
//   placenameDuplicateStore.values();

export const placenameStream = async ({ offline = true } = {}) =>
  offline
    ? placenameStore.values()
    : first([
        placenameStore.values(),
        placenameAPISearch({ page: "0..100", sort: `name:asc` }),
      ]);

// v2search = query =>
//   placenameAPISearch({ page: "0..100", q: "", ...query });

export const goto = (
  href,
  {
    state = null,
    title = "",
    host = window,
    method = "replaceState",
    event = new PopStateEvent("popstate"),
  } = {}
) => {
  history[method](state, title, href);
  host.dispatchEvent(event);
};

export const isAreaDup = ({ name, area }) => {
  let dup = false;
  area = decodeArea(area);
  name = decode(name);

  if (area === SV) {
    dup = dupSV.includes(name);
  }
  if (area === DML) {
    dup = dupDML.includes(name);
  }
  return dup;
};

export const isDup = (name) => {
  return isAreaDup(name, SV) || isAreaDup(name, DML);
};

export const duplicatesForArea = (area) => {
  let d = [];
  if (area === SV) {
    d = dupSV;
  } else if (area === DML) {
    d = dupDML;
  }
  return d;
};

export { path } from "./path.js";
