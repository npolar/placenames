import { getCaseByNumber } from "./case/get.js";
import { put as putCase } from "./case/put.js";

import { get as getPlacename } from "./feature/get.js";
import { put as putPlacename } from "./feature/put.js";

const placenameIDs = (placenames = []) => new Set(placenames.map((p) => p.id));
const caseIDs = (cases = []) => new Set(cases.map((p) => p["@id"]));

export const addPlacenameToCase = async (
  sak,
  { id, name, area, status, beginLifespanVersion },
  { host } = {}
) => {
  const n = sak["@id"];
  if (n > 0) {
    if (!sak.id) {
      sak = await getCaseByNumber(n, { host });
    }
    if (!placenameIDs(sak.placenames).has(id)) {
      sak.placenames = [
        ...sak.placenames,
        { id, name, area, status, beginLifespanVersion },
      ].sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));
      putCase(sak, { host });
    }
    const p = await getPlacename({ id });

    if (!caseIDs(p.cases).has(n)) {
      p.cases = [...p.cases, { "@id": n }];
      await putPlacename(p, { host });
    }
  }
  return sak;
};

export const removePlacenameFromCase = async (
  sak,
  { id, ...placename },
  host
) => {
  const n = sak["@id"];
  if (placenameIDs(sak.placenames).has(id)) {
    sak.placenames = sak.placenames.filter((p) => p.id !== id);
    putCase(sak, { host });
  }
  const p = await getPlacename({ id });
  if (caseIDs(p.cases).has(n)) {
    p.cases = p.cases.filter((c) => c["@id"] !== n);
    p.updated_by = "";
    await putPlacename(p, { host });
  }
  return sak;
};
