import { addCircle } from "./add-circle.js";
import { path } from "../placename/path.js";
import {
  control,
  popup,
  circleMarker,
  tileLayer,
  featureGroup as createFeatureGroup,
  geoJSON,
} from "leaflet/dist/leaflet-src.esm.js";

export const addFeatureGroupToMap = ({
  map,
  featureGroup = createFeatureGroup(),
  name,
  features,
  options = { color: "green", radius: 8 },
} = {}) => {
  featureGroup.addTo(map);
  // features = features.filter(({ geometry: { coordinates } }) => {
  //   coordinates && coordinates.length >= 2 && coordinates.length <= 3;
  // });
  addCirclesToFeatureGroup({ features, featureGroup, options });

  const groups = {
    [name]: featureGroup,
  };
  control.layers(null, groups, { collapsed: false }).addTo(map);
  if (features && features.length > 0) {
    map.fitBounds(featureGroup.getBounds());
  }
  return featureGroup;
};

export const addCirclesToFeatureGroup = ({
  features = [],
  featureGroup,
  options,
}) => {
  const points = features.filter(
    (feature) =>
      // Filter away anything but points
      "Point" === feature.geometry.type &&
      // Exclude [0,0] && null
      ![undefined, null].includes(feature.geometry.coordinates) &&
      new Set(feature.geometry.coordinates.slice(0, 2)).size > 1
  );

  for (const feature of points) {
    addCircle({
      feature,
      featureGroup,
      options,
    });
  }
};
