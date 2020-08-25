import { readNDJSON } from "../../read-ndjson.js";
const { warn } = console;

const cases = readNDJSON("asset/seed/cases.ndjson");
const map = new Map(cases.map((c) => [c["@id"], c]));

import { extractYear } from "../../placename/first-year.js";
export default (p) => {
  if (!p.first) {
    p.first = {};
  }
  const { proposer, created, cases, references } = p;

  if (cases && cases.length > 0) {
    const firstCaseNumber = cases[0]["@id"];
    const firstCase = map.get(+firstCaseNumber);
    if (!firstCase) {
      warn("Missing case:", firstCaseNumber);
      // Missing case: 400
      // Missing case: 399
      // Missing case: 396
      // Missing case: 394
    } else {
      p.first.case = firstCase.date;
    }
  }
  if (references) {
    const published = references
      .map((r) => extractYear(r.title))
      .sort()
      .shift();
    p.first.published = published;
  }
  if (proposer) {
    p.first.proposed = extractYear(proposer);
  }

  if (created) {
    p.first.created = created.split(/[t\s]/i)[0];
    // Significant creation dates (N>100):
    // 6756 "2002-01-01"
    // 1014 "2004-01-30"
    //  940 "2010-01-30"
    //  426 "2008-01-01"
    //  118 "2011-01-30"
  }
  if (!p.first.published && p.first.proposed) {
    // proposed contains a mix if real references and just person + year...
    //p.first.published = p.first.proposed;
  }
  const firstUse = Object.values(p.first).sort().shift();

  p.first.use = firstUse;
  p.first.year = String(p.first.use).substring(0, 4);
  p.first.decade = p.first.year.substring(0, 3) + "0";
  p.first.century = p.first.year.substring(0, 2) + "00";

  return p;
};
