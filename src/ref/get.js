import { refMap } from "./ref-map.js";

export const get = (id) => (id && refMap.has(id) ? refMap.get(id) : {});
