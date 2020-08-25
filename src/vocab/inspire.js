// https://inspire.ec.europa.eu/documents/Data_Specifications/INSPIRE_DataSpecification_GN_v3.1.pdf

// «codeList»
// NamedPlaceTypeValue
// + administrativeUnit
// + building
// + hydrography
// + landcover
// + landform
// + populatedPlace
// + protectedSite
// + transportNetwork

export const namedPlaceTypes = [
  "administrativeUnit",
  "building",
  "hydrography",
  "landcover",
  "landform",
  "other",
  "populatedPlace",
  "protectedSite",
  "transportNetwork",
];

// «codeList»
// NameStatusValue
// + official
// + standardised
// + historical
// + other
export const nameStatuses = ["official", "standardised", "historical", "other"];
// Notice that 2 other statuses are used in schema v2: "draft", "suggestion"
