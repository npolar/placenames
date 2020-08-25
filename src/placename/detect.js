import {
  fetchByNames,
  //findPlacenamesUpdatedAfter,
} from "../api/v2/placename/feature/search.js";
import {
  //officialNameMapsFrozenDatetime,
  officialInAreaMap,
  officalWithSpaceInArea,
} from "./by-area/official/official-in-area.js";

const actualFirstCharacters = "'123678AbBcCČdDEÉFgGhHIîJKlLŁmMnNoOpPQrRsSŚŠtTuUvVWXYÜzZŽÆÄØÖÅ".split(
  ""
);
const actualFirstCharactersExceptLowercase = actualFirstCharacters.filter(
  (c) => !/[a-z]/.test(c)
);

const actualSecondCharacters = " -:.'[049aAábcčdeéèêěëėfFghijkKlLłmnoóòôprstTuUvwWxyüzžæäøöå".split(
  ""
);

// Get candidates by splitting on space, comma, newline, dot
// and by filtering on actual 2 first chracters...
const candidatesBasedOnFirstCharacters = (text) =>
  text
    .split(/[,\s.\n]/)
    .map((c) => c.trim().replace(/[.,]$/, ""))
    .filter(
      (s) =>
        s.length > 2 &&
        actualFirstCharactersExceptLowercase.includes(s.substring(0, 1)) &&
        actualSecondCharacters.includes(s.substring(1, 2))
    );

// const fetchNamesAfterFreezeDate = async ({ area, datetime }) => {
//   const { results } = await findPlacenamesUpdatedAfter({ datetime, area });
//   return (results || []).map((p) => p.name);
// };

export const detect = async (
  text,
  {
    area = "Svalbard",
    nameMap = officialInAreaMap(area),
    dereference = false,
  } = {}
) => {
  const spaceMatches = [...officalWithSpaceInArea(area)].filter((c) =>
    new RegExp(c).exec(text)
  );

  const cand = candidatesBasedOnFirstCharacters(text);
  const frozenMatches = new Set(cand.filter((name) => nameMap.has(name)));
  // const freshMatches = await fetchNamesAfterFreezeDate({
  //   area,
  //   datetime: officialNameMapsFrozenDatetime,
  // });

  const matches = [...new Set([...spaceMatches, ...frozenMatches])];

  if (dereference) {
    return fetchByNames(matches, { area });
  }
  return matches;
};
