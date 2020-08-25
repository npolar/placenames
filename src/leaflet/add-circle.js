import { path } from "../placename/path.js";
import {
  control,
  popup,
  circleMarker,
  tileLayer,
  featureGroup,
  geoJSON,
} from "leaflet/dist/leaflet-src.esm.js";

// import { points as pointsfc } from "../turf/helpers.js";
// import tin from "../turf/tin.js";
export const addCircle = ({
  feature,
  featureGroup,
  href = path,
  popup = `<b><a href="${path(feature)}">${feature.name}</a></b>`,
  options = {},
} = {}) => {
  const { area, geometry } = feature;
  const { coordinates, type } = geometry;
  const [lng, lat] = coordinates;
  const opt = {
    radius: 12,
    color: "red",
    opacity: 0.8,
    fillOpacity: 0.4,
    weight: 1,
    ...options,
  };
  const c = circleMarker([lat, lng], opt);
  const pop = c.bindPopup(popup);
  c.addTo(featureGroup);
};
