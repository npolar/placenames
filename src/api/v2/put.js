import {
  emitFetchError,
  emitFetchOK,
} from "@npolar/fetch-api/src/event/exports.js";
import { url } from "./url.js";
import { getJWT } from "../../store/user.js";
export const put = async (
  payload,
  {
    endpoint,
    method = "PUT",
    host = undefined,
    jwt = undefined,
    base = undefined,
  }
) => {
  const { id } = payload;
  method = id === undefined ? "POST" : method;
  jwt = jwt === undefined ? await getJWT() : jwt;

  const authorization = `Bearer ${jwt}`;

  const response = await fetch(url({ id, endpoint, base }), {
    method,
    headers: { authorization, "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((error) => {
    emitFetchError({
      response: { status: 0, statusText: `${method} failed`, url },
      method,
      host,
    });
  });
  if (host && response && response.ok === false) {
    emitFetchError({ response, method, host });
  }
  if (host && response.ok === true && /post/i.test(method)) {
    emitFetchOK({ response, method, host });
  }
  return response.json();
};
