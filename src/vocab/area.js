export const SV = "Svalbard";
export const JM = "Jan Mayen";
export const P1 = "Peter I Øy";
export const BV = "Bouvetøya";
export const DML = "Dronning Maud Land";
export const AQ = "Antarktis";
export const ARCTIC = "Arktis";

export const areas = [ARCTIC, AQ, SV, JM, BV, P1, DML].sort();

export const areaCode = [
  [SV, "sv"],
  [JM, "jm"],
  [BV, "bv"],
  [P1, "p1"],
  [DML, "dml"],
  ["Antarktis", "antarktis"],
];

export const codeArea = [
  ...areaCode.map(([k, v]) => [v, k]),
  ["ja", JM],
  ["bo", BV],
  ["pe", P1],
  ["dr", DML],
];

export const decode = (
  areaOrCode,
  { known = areas, map = new Map(codeArea) } = {}
) => {
  if ([null, undefined].includes(areaOrCode)) {
    return;
  }
  if (areas.includes(areaOrCode)) {
    return areaOrCode;
  }

  const code = areaOrCode.substring(0, 2).toLowerCase();
  return map.get(code);
};

export const encode = (area, { map = new Map(areaCode) } = {}) => map.get(area);
