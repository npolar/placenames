import { areas } from "../vocab/area.js";
import { encode } from "./params.js";
import { isUUID } from "@npolar/fetch-api/src/uuid.js";
import { isUnique } from "./dupl.js";

export const base = "/";

const suffixForName = ({ name, _id, id, area, except = [...areas] } = {}) => {
  // if (except.includes(name)) {
  //   return "";
  // }
  if (!id) {
    id = _id;
  }
  let suf = `/${encode(area)}`;
  if (id && isUUID(id)) {
    suf += `/${id}`;
  }
  return suf;
};

// - /Pyramiden [area blank and non-unique name] ?
// - /Pyramiden/Svalbard => show duplication warning
// - /Krasil'ščikovtoppen/Svalbard => IRI
// - /Pyramiden/Dronning_Maud_Land

//export const getDup = async id => placenameDuplicateStore.get(id);

/**
 Create path component for use in IRIs like /${name}/{area}
 - /Svea/Svalbard
 - /Krasil'ščikovtoppen/Svalbard
 - /Svalbard
 - /Sørpolen
 - /Fenriskjeften/Dronning_Maud_Land
 - /Nordenskiöld_Land/Svalbard
 */
export const path = (
  { name, area, id, _id, ident, ...p },
  { prefix = base, suffix = suffixForName({ name, area, id, ident }) } = {}
) => {
  if (!id && p["@id"]) {
    id = p["@id"];
  }
  if (!area && id && isUUID(id)) {
    return `${prefix}${id}`;
  }
  return `${prefix}${encode(name)}${suffix}`.replace(/\/$/, "");
};

export const shareURL = ({
  name,
  area,
  id,
  status,
  base = `https://stadnamn.npolar.no`,
}) => {
  if (!areas.includes(area)) {
    return base + path({ name });
  }
  return status === "official" && isUnique({ name, area })
    ? base + path({ name, area })
    : base + path({ name, area, id });
};
