// "authority"
// "name_committee_case"
// "replaced_by"
// "replaces"
// "same_as"
const nakedID = (r) => {
  r["@id"] = r["@id"].split("/").pop();
  return r;
};
export default (p) => {
  const { replaced_by, replaces, same_as, ...m } = p;
  if (replaced_by) {
    m.replaced_by = replaced_by.map(nakedID);
  }
  if (replaces) {
    m.replaces = replaces.map(nakedID);
  } else {
    m.replaces = [];
  }
  if (same_as) {
    m.same_as = same_as.map(nakedID);
  }
  return m;
};
