export const caseProperties = {
  number: { type: Number, reflect: true }, // The case number
  lang: { type: String, reflect: true },
  case: { type: Object },
  placenames: { type: Array }, // dereferenced placenames (from case.placenames)
  detected: { type: Array }, // dereferenced placenames (from protocol/comment text detection)
  //maxcase: { type: Number, reflect: true },
  //placenamesLinked: { type: Boolean },
  authorized: { type: Boolean },
  jwt: { type: String },
  editing: { type: Boolean },
  validity: { type: Object },
  patches: { type: Array },
};
