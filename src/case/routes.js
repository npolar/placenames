import "../cases-search/cases-search.js";
import "../case-article/case-article.js";
import "../case-edit/case-edit.js";

import { base } from "./base.js";

const routes = (base) => [
  {
    path: `${base}/ny`,
    component: "case-edit",
  },
  {
    path: `${base}/skriv/:number?`,
    component: "case-edit",
  },
  {
    path: `${base}/:number`,
    component: "case-article",
  },
  {
    path: `${base}`,
    component: "cases-search",
  },
  {
    path: `${base}/(.*)`,
    component: "cases-search",
  },
];

export default [
  ...routes(base),
  ...routes("/case"), // /case for en/legacy
];
