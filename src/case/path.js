import { base } from "./base.js";
const extractNumber = (sak) =>
  Number(sak) === sak ? sak : sak && sak["@id"] ? sak["@id"] : "";
export const path = (sak) => `${base}/${extractNumber(sak)}`;

export const editPath = (sak) => `${base}/edit/${extractNumber(sak)}`;
