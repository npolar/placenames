import noMore from "./no-more.js";
import cases from "./cases.js";
import relations from "./relations.js";
import references from "./references.js";
import { firstYear } from "../../../../placename/first-year.js";
//import { deepCopy } from "@npolar/patch-event";
const { stringify, parse } = JSON;
const deepCopy = (o) => parse(stringify(o));
export default (v1) => {
  if (undefined === v1 || !v1._rev) {
    return;
  }

  let v2 = noMore(deepCopy(v1));
  v2 = cases(v2);
  v2 = relations(v2);
  v2 = references(v2);

  v2.beginLifespanVersion = firstYear(v2);
  return v2;
};
