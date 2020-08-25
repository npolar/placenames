//@crit import { placenameStore } from "./store.js";
import {
  get as GET,
  search as searchAPI1,
} from "@npolar/fetch-api/src/v1/exports.js";
import { decode as decodeArea, encode as encodeArea } from "../vocab/area.js";
import { isUUID } from "@npolar/fetch-api/src/uuid.js";

export const getUUID = async (id) => {
  console.log(id, GET);
  const r = await GET(id, { endpoint: "/placename" });
  if (r.ok) {
    return await r.json();
  } else {
    throw id;
  }
};

export const get = async (name, { id, area, ident, offline, host } = {}) => {
  // UUID trumps anything
  if (isUUID(id)) {
    return getUUID(id, { name, area, ident, offline, host });
  }
  // Legacy numeric ident
  if (ident && Number(ident) > 0) {
    const r = await searchAPI1("", {
      filters: [["ident", ident]],
    });
    if (r.ok) {
      let arr = await r.json();
      if (arr && arr.length > 0) {
        let [p] = arr;
        p = tov2(p);
        if (
          p &&
          (p.name.toLowerCase() !== name.toLowerCase() || +p.ident !== +ident)
        ) {
          throw `Wrong name for ident ${ident}`;
        }
        return p;
      }
    }
  } else {
    // @todo rather use indexed db name index here and fallback to API v1 as last resort...
    // there is no guaranteed way to get a name from the API :/
    //
    area = decodeArea(area);
    // if (ident && isAreaDup({ name, area })) {
    //   name += `/${ident}`;
    // }
    // const key = idbkey({ name: decode(name), area, ident });

    const r = await searchAPI1(name, {
      filters: [
        ["status", "official"],
        // @todo field-q https://api.npolar.no/placename/?q-name.@value=Galteryggen
        //["q-name.@value", name],
        ["area", area],
      ],
    });
    if (r.ok) {
      let [p] = await r.json();
      p = tov2(p);
      if (
        p &&
        (p.name.toLowerCase() !== name.toLowerCase() ||
          encodeArea(p.area) !== encodeArea(area))
      ) {
        throw `Wrong name ${p.name} instead of ${name}`;
      }
      return p;
    }
    return offline
      ? placenameStore.get(key)
      : first([placenameStore.get(key), fetchPlacename(name)]);
  }
  return undefined;
};
