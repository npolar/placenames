export default p => {
  if (p) {
    const { name_committee_case, ...rest } = p;
    let m = rest;
    let cases = (name_committee_case || []).map(c => {
      let id = c["@id"];
      //let label = c.label;
      if (!id && c["label"]) {
        id = c["label"].replace(/sak\s/i, "").replace(/[\D]/g, "|");
      }
      if (/^http/.test(id)) {
        id = id.split("/").pop();
      }
      return { "@id": Number.isNaN(Number(id)) ? undefined : Number(id) };
    });
    cases = cases.filter(c => c["@id"] !== undefined && c["@id"] !== "|");
    cases = cases.sort((a, b) => a["@id"] > b["@id"]);
    m.cases = cases;
    return m;
  } else {
    return undefined;
  }
};
