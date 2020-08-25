//import { readNDJSON } from "../../read-ndjson.js";
//const { warn } = console;
//import noMore from "./no-more.js";

// // Read in all names to map for accessing historical references
// const placenames = readNDJSON(
//   "process/placename/v1-to-v2/placenames-v1.ndjson"
// ).map(p => noMore(p));

//const map = new Map(placenames.map(p => [p.id, p]));

export default p => {
  const { reference, referenceid, ...rest } = p;
  let m = rest;
  let i = 0;
  let refs = new Map((reference || []).map(title => [referenceid[i++], title]));
  // Integrate references from historical names
  /*if (m.replaces) {
    const replacedIDs = m.replaces.map(r => r["@id"]);
    replacedIDs.forEach(id => {
      const rep = map.get(id);
      let j = 0;
      if (rep && rep.reference && rep.referenceid) {
        rep.referenceid.map(refid => {
          if (!refs.has(+refid)) {
            refs.set(+refid, rep.reference[j]);
          }
          j++;
        });
      }
    });
  }*/
  const references = [];
  for (const [ident, title] of refs) {
    references.push({ title, ident });
  }
  m.references = references.sort((a, b) => a.title.localeCompare(b.title));
  delete m.reference;
  delete m.referenceid;
  return m;
};

// Buchananisen [
//   [ 'b2b355d4-13ac-5add-a5c6-cae8c71c674b', true ],
//   [ '14a4b0fe-e946-5dfc-adf6-35fc6d148f1b', true ],
//   [ 'c88fcf05-1128-585f-9a20-903ac420444b', false ], // unknown...
//   [ '0e83acae-27a4-55d3-a2a0-1610134771ff', true ]
// ]

// remove Kartotek => comment!?
