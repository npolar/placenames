const { entries } = Object;

const flatten = (m, o) => {
  for (const [k, v] of entries(o)) {
    m[k] = v;
  }
  return m;
};

const country = (code) => {
  const m = new Map([
    ["Argentina", "AR"],
    ["Australia", "AU"],
    ["BL", "BE"],
    ["Belgium", "BE"],
    ["Chile", "CL"],
    ["Germany", "DE"],
    ["India", "IN"],
    ["Japan", "JP"],
    ["Russia", "RU"],
    ["South Africa", "ZA"],
    ["USA", "US"],
    ["United Kingdom", "GB"],
    ["New Zealand", "NZ"],
    ["npolar.no", "NO"],
  ]);
  return m.has(code) ? m.get(code) : code;
};

// No more name as object
// No more properties, relations, texts
export default (p) => {
  if (undefined === p) {
    return;
  }

  const {
    name,
    properties,
    texts,
    relations,
    longitude,
    latitude,
    altitude,
    id,
    _id,
    _rev,
    ...rest
  } = p;

  let m = rest;
  m.id = _id || id;
  m.name = name["@value"];
  m["@language"] = name["@language"];

  m.type = "Feature";

  if (properties) {
    delete properties.label;
    m = flatten(m, properties);
  }
  if (texts) {
    m = flatten(m, texts);
  }
  if (relations) {
    m = flatten(m, relations);
  }
  if (!m.geometry) {
    m.geometry = {
      type: "Point",
      coordinates: [longitude, latitude, altitude],
    };
  }
  m.country_of_origin = country(m.country_of_origin);
  if (m.authority && m.authority["@id"]) {
    m.authority = country(m.authority["@id"].replace("_", null));
  }
  ["origin", "definition", "note"].map((k) => {
    if (!m[k]) {
      m[k] = Object.create({ en: null, nn: null });
    }
  });
  // if (/^[0-9]+-/.test(_rev)) {
  //   m.rev = _rev;
  // }
  m.country_of_authority = m.authority;
  m.schema = undefined;
  m._rev = undefined;
  m.authority = undefined;
  m.country_of_origin = undefined;
  m.terrain = m.terrain.nn;
  return m;
};
