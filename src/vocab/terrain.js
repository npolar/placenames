export const terrains = [
  //"named-place",
  "mountain",
  "glacier",
  "point",
  "lake",
  "bay",
  "island"
];

// 553 "valley/ravine"
// 322 "river/brook"
// 198 "rock"
// 196 "pass"
// 193 "hill"
// 166 "shore/coast"
// 157 "plain/expanse/plateau"
// 155 "islet/skerry/rock"
// 117 "shoal/shallow/reef"
// 106 "ice-depression/corrie/cirque"
//  86 "house"
//  82 "rock-face/precipice/cliff"
//  81 "strait/sound"

//$ cat asset/seed/placenames-v2.ndjson | ndjson-map 'd.terrain.en' | sort | uniq -c | sort -rn | head -n20
// 9664 "named-place"
// 5460 "mountain"
// 1746 "glacier"
//  936 "point"
//  721 "lake"
//  672 "bay"
//  669 "island"
//  553 "valley/ravine"
//  322 "river/brook"
//  198 "rock"
//  196 "pass"
//  193 "hill"
//  166 "shore/coast"
//  157 "plain/expanse/plateau"
//  155 "islet/skerry/rock"
//  117 "shoal/shallow/reef"
//  106 "ice-depression/corrie/cirque"
//   86 "house"
//   82 "rock-face/precipice/cliff"
//   81 "strait/sound"
//

// $ cat asset/seed/placenames-v2.ndjson | ndjson-map 'd.terrain.nn' | sort | uniq | ndjson-reduce 'p.push(d),p' '[]'
export const terreng = /* 66 */ [
  "adm-inndeling",
  "bakke",
  "banke",
  "brefall",
  "brehylle",
  "bresenking/botn",
  "bresprekk",
  "bukt",
  "bustad",
  "bygningar",
  "dal",
  "djup",
  "elv",
  "fjell",
  "fjord",
  "flyplass",
  "foss",
  "fyr",
  "gammal-buplass",
  "grotte",
  "grunne",
  "gruve",
  "halvøy",
  "hamn",
  "havområde",
  "holme",
  "hus",
  "hytte",
  "isbre",
  "iskuppel",
  "kjelde",
  "krater",
  "kyrkje",
  "kyst",
  "landskapsområde",
  "lavastraum",
  "li",
  "meteorologisk-stasjon",
  "monument",
  "nes",
  "område/distrikt",
  "os",
  "pass",
  "renne",
  "rygg-i-sjø",
  "sand",
  "skar",
  "slette/vidde",
  "stadnamn",
  "stasjon",
  "stein",
  "strand",
  "straum",
  "stup",
  "sund",
  "undersjøisk-objekt",
  "ur",
  "utmål",
  "varde",
  "vatn",
  "veg",
  "verneområde",
  "vik",
  "øy",
  "øygruppe",
  "ås"
];

export const en = {
  Terrain: "Terrain",
  terrain_type: "",
  terrain: "terrain",
  stadnamn: "placename",
  fjell: "mountain",
  isbre: "glacier",
  nes: "point",
  vatn: "lake",
  øy: "island",
  vik: "bay",
  dal: "valley",
  elv: "river",
  stein: "rock",
  skar: "pass",
  ås: "hill",
  strand: "beach",
  ["slette/vidde"]: "plateau",
  holme: "islet",
  grunne: "shoal/shallow/reef",
  ["bresenking/botn"]: "ice depression/corrie/cirque",
  hytte: "house",
  stup: "cliff",
  sund: "strait",
  li: "slope",
  landskapsområde: "area/district/region",
  iskuppel: "ice dome",
  sand: "moraine",
  stasjon: "station",
  brefall: "ice fall",
  fjord: "fjord",
  halvøy: "peninsula",
  banke: "bank",
  utmål: "recognised claim",
  hamn: "anchorage",
  krater: "crater",
  gruve: "mine",
  verneområde: "protected area",
  øygruppe: "island group",
  brehylle: "ice shelf",
  djup: "deep",
  fyr: "beacon",
  varde: "cairn",
  ["gammal-buplass"]: "historic settlement",
  havområde: "ocean",
  bresprekk: "crevasse",
  renne: "submarine channel",
  bygningar: "build cluster",
  ["område/distrikt"]: "area/district",
  ["adm-inndeling"]: "territory",
  bakke: "submarine slope",
  grotte: "cave",
  ["rygg-i-sjø"]: "submarine ridge",
  foss: "waterfall",
  bukt: "bay",
  ur: "scree",
  os: "river outlet",
  bustad: "settlement",
  monument: "monument",
  ["undersjøisk-objekt"]: "submarine object",
  kjelde: "",
  straum: "current",
  kyst: "coast",
  veg: "road",
  ["meteorologisk-stasjon"]: "meteorological station",
  ruin: "ruine",
  pass: "pass",
  hus: "house",
  lavastraum: "lava river",
  morene: "moraine",
  flyplass: "airport",
  kyrkje: "church"
}

export const nn = {
  Terrain: "Terreng",
  terrain_type: "Inspire type",
  terrain: "terreng"
};
