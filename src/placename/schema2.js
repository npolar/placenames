import { areas, AQ, DML, P1 } from "../vocab/area.js";

const { keys } = Object;

const id = "https://npolar.no/schema/placename-v2";
const version = "2.0.0-pre";
const languages = ["nn", "en"];
// const languageMap = {
//   properties: languages.map(lang => {
//     return [lang]: {
//       "type": "string"
//     }
//   })
// };
const name = {
  path: "/name",
  type: "string",
  minLength: 3,
  maxLength: 64,
  pattern: "^[A-ZÆØÅ]+.+$",
};

const area = {
  name: "area",
  path: "/area",
  type: "string",
  enum: areas,
};

export const statuses = [
  "draft",
  "suggestion",
  "official",
  "historical",
  "standardised",
  "other",
];
const status = {
  name: "status",
  path: "/status",
  type: "string",
  enum: statuses,
  default: "official",
  translations: {
    enum: {},
    property: {
      en: "",
      nn: "",
    },
  },
};
// const origin = {
//   languages,
//   path: "/origin",
//   type: "object"
// };

export const countryFromArea = (area) =>
  [AQ, DML, P1].includes(area) ? "AQ" : "NO";

const LANGUAGE = "@language";

export const create = ({
  status = null,
  name = null,
  area = null,
  country = "NO",
  language = "nn",
  type = "Feature",
  geometry = { type: "Point", coordinates: null },
  properties = null,
  ...rest
} = {}) => {
  return {
    ...rest,
    name,
    [LANGUAGE]: language,
    status,
    area,
    country,
    geometry,
    properties,
    type,
  };
};
// PlacenameResource.create = function() {
//     return { type: "Feature", area: "Svalbard", country:
//       "NO", country_of_authority: "NO", latitude: 0, longitude: 0,
//       name: { '@language': 'nn' },
//       terrain: { en: 'named-place', nn: 'stadnamn'},
//       relations: { authority: { '@id': 'npolar.no' } }
//     };
//   };

export const PlacenamesSchema2 = {
  $id: id,
  languages,
  version,
  properties: { name, status, area },
};

export const enumFor = (prop, { schema = PlacenamesSchema2 } = {}) =>
  schema.properties[prop].enum;

export const optionsForEnum = (prop, { g }) =>
  enumFor(prop).map((value) => {
    return { value, text: g(`name.${prop}.${value}`) };
  });

export const properties = (fields, { schema = PlacenamesSchema2 } = {}) =>
  keys(schema.properties)
    .filter((k) => (fields ? fields.includes(k) : true))
    .map((k) => schema.properties[k]);
