// See also first-use in v1=>v2 migration
//
// @otdo Migrate away beginf lifespan from origin?
//curl "https://v2-api.npolar.no/placename/feature/_search?type=feed&page=.." |  ./mig.js ~/@npolar/placenames/src/placename/first-year.js  | ndjson-map '[d.firstYear

import { caseYearMap } from "../case/case-year-map.js";
import { refYearMap } from "../ref/ref-year-map.js";

export const extractYear = (s) => {
  const saneYear = (y) => +y > 1500 && +y < new Date().getFullYear() + 2;

  // const r = /\(?(?<year>[0-9]{4})\)?/.exec(s);
  // if (r) {
  //   const { groups } = r;
  //   const y = +groups.year;
  //   if (saneYear(y)) {
  //     return y;
  //   }
  // }
};

// Find year of first use, by looking up years in the following sequence:
// * INSPIRE property beginLifespanVersion
// * proposed year
// * year of first case
// * year of first reference
// * created year (only for Svalbard/Jan Mayen - and if after 2002/2008)
export const firstYear = ({
  beginLifespanVersion,
  cases,
  references,
  proposer,
  origin,
  created,
  area,
}) => {
  let y =
    beginLifespanVersion && beginLifespanVersion > 1596
      ? beginLifespanVersion
      : undefined;

  if (!y && proposer) {
    // Proposer is a mix of real references and just a "some name (year)"
    y = extractYear(proposer);
  }

  if (!y && origin) {
    const origintext = Object.values(origin).join(" ");
    y = extractYear(origintext);
  }

  if (!y && cases) {
    const caseNumbersSorted = cases.map((c) => parseInt(c["@id"])).sort();
    if (caseNumbersSorted.length && caseNumbersSorted.length > 0) {
      y = caseYearMap.get(caseNumbersSorted[0]);
    }
  }

  if (!y && references) {
    const refYearsSorted = references
      .map((r) => refYearMap.get(r.ident))
      .sort();
    if (refYearsSorted.length && refYearsSorted.length > 0) {
      y = refYearsSorted[0];
    }
  }

  // For Svalbard and Jan Mayen: use created year, when these are after first database import
  if (!y && created) {
    const yearCreated = new Date(created).getFullYear();
    y = yearCreated > 2002 && area === "Svalbard" ? yearCreated : y;
    y = yearCreated > 2008 && area === "Jan Mayen" ? yearCreated : y;
  }
  return y;
};
export default (o) => {
  o.firstYear = firstYear(o);
  return o;
};
