export const create = ({
  name = null,
  area = null,
  country = "NO",
  status = "official",
  longitude = 0,
  latitude = 0,
  altitude = 0
} = {}) => {
  return {
    type: "Feature",
    area,
    country,
    longitude,
    latitude,
    altitude,
    country_of_authority: "NO",
    terrain: { en: "named-place", nn: "stadnamn" },
    relations: {
      authority: { "@id": "npolar.no" },
      replaces: [],
      replaced_by: [],
      same_as: [],
      name_committee_case: [{ "@id": "", label: "" }]
    },
    status,
    texts: {
      definition: {
        en: "",
        nn: ""
      },
      origin: {
        en: "",
        nn: ""
      },
      note: {
        en: "",
        nn: ""
      }
    },
    terrain_type: "landcover",
    name: { "@language": "nn", "@value": name },
    geometry: { type: "Point", coordinates: [longitude, latitude, altitude] }
  };
};
