// if (lds instanceof Array) {
//   const entries = lds.map(e => [e["@language"], e["@value"]]);
//   m = new Map(entries);
// } else {
//   m = new Map(Object.entries(lds));
// }

export const s = (lds, lang) => {
  let m;
  if (lds instanceof Array) {
    const entries = lds.map(e => [e["@language"], e["@value"]]);
    m = new Map(entries);
  } else {
    m = new Map(Object.entries(lds));
  }
  if (m.has(lang)) {
    return m.get(lang);
  } else {
    const first = [...m.values()][0];
    return first;
    ///^n(o|n|b)/.test(lang)
  }
};
