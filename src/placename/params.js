import { isUUID } from "@npolar/fetch-api/src/uuid.js";

const { fromEntries } = Object;
const { isInteger } = Number;

export const encode = (id) =>
  encodeURIComponent(String(id || "").replace(/\s/g, "_")).replace(
    /"%27"/g,
    "%20"
  );

export const decode = (id) =>
  decodeURIComponent(String(id || "").replace(/(\s|_|\+)/g, " ")).replace(
    /%20/g,
    "'"
  );

export const extractParams = ({ vaadinRouterLocation, searchParams }) => {
  let { params } = vaadinRouterLocation;
  if (searchParams) {
    params = { ...params, ...fromEntries(searchParams) };
  }

  let { name, area, id, ident } = params;
  name = decode(name); // _=>" "
  area = decode(area); // eg. sv => Svalbard
  const uuid = [name, area, id].find((s) => isUUID(s));
  if (!ident) {
    ident = [name, area, id].find((s) => isInteger(+s));
  }
  return { id: uuid, name, area, ident };
};
