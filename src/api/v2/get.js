import { url } from "./url.js";
import { emitFetchError } from "@npolar/fetch-api/src/event/exports.js";

export const get = async ({ id, endpoint, method = "get", jwt, host }) => {
  const response = await fetch(url({ id, endpoint })).catch((error) => {
    emitFetchError({
      response: { status: 0, statusText: `GET failed`, url },
      method,
      host,
    });
  });
  if (host && response && response.ok === false) {
    emitFetchError({ response, method, host });
  }
  return response.json();
};
