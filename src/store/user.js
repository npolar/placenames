import { decode, isValid as isValidJWT } from "@npolar/fetch-api/src/jwt.js";
import { authorize } from "@npolar/fetch-api/src/v1/user/authorize.js";
import { refresh } from "@npolar/fetch-api/src/v1/user/authenticate.js";
import { isNorwegian, prefer } from "../translate/exports.js";

const JWTKEY = "jwt";
const SYSTEM = "https://api.npolar.no/placename";
export const storage = localStorage;
export const getJWT = async () => storage.getItem(JWTKEY);

export const getJWTIfValid = async () => {
  const jwt = await getJWT();
  return isValidJWT(jwt) ? jwt : undefined;
};

export { isValidJWT };

export const deleteJWT = async () => storage.removeItem(JWTKEY);

export const setJWT = async (jwt) => storage.setItem(JWTKEY, jwt);

export const getRights = async ({ user, system = SYSTEM } = {}) => {
  if (!user) {
    return [];
  }
  const { rights } = user.systems.filter(
    (s) => s.uri === SYSTEM || s.uri === "https://api.npolar.no/*"
  )[0];
  return rights;
};

export const getEmail = async () => storage.getItem("email");
export const setEmail = async (email) => storage.setItem("email", email);

export const getUserLang = () => {
  let lang = localStorage.getItem("lang");
  return lang && lang.length > 0 ? lang : isNorwegian(prefer()) ? "nn" : "en";
};

export const isAuthorized = async ({
  jwt,
  system = SYSTEM,
  refresh,
  check = ({ jwt, rights }) => true,
} = {}) => {
  if (jwt === undefined || !isValidJWT(jwt)) {
    jwt = await getJWTIfValid();
  }

  if (jwt) {
    const { status, rights } = (await authorize({ system, jwt })) || {};

    return status && rights && 200 === status && check({ jwt, rights })
      ? true
      : false;
  }
};
