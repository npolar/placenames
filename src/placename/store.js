// @crit
// import { factory } from "../store/factory.js";
// import { mark } from "../html/linkify.js";
// export const patchStore = factory("placename-patches", { dbName: "patches" });
//
// export const placenameStore = factory("placename", {
//   storeOptions: {
//     autoIncrement: false,
//     keyPath: "_id"
//   },
//   indices: [["area"], ["created"], ["updated"], ["name"]]
//   //key: ({ _id }) => _id;
// });
//
// const actualFirstCharacters = "'123678AbBcCČdDEÉFgGhHIîJKlLŁmMnNoOpPQrRsSŚŠtTuUvVWXYÜzZŽÆÄØÖÅ".split(
//   ""
// );
// const actualFirstCharactersExceptLowercase = actualFirstCharacters.filter(
//   c => !/[a-z]/.test(c)
// );
//
// const actualSecondCharacters = " -:.'[049aAábcčdeéèêěëėfFghijkKlLłmnoóòôprstTuUvwWxyüzžæäøöå".split(
//   ""
// );
//
// const candidates = text =>
//   text
//     .split(/[\s\.\n]/)
//     .filter(
//       s =>
//         s.length > 2 &&
//         actualFirstCharactersExceptLowercase.includes(s.substring(0, 1)) &&
//         actualSecondCharacters.includes(s.substring(1, 2))
//     );
//
// export const detect = async (text, { area } = {}) => {
//   const cand = candidates(text);
//
//   let found = (await placenameStore.all()).filter(p =>
//     cand.includes(p.name["@value"])
//   );
//   if (area) {
//     found = found.filter(p => p.area === area);
//   }
//   console.log({ cand, found: found.map(p => p.name["@value"]) });
//   return found;
// };
