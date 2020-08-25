import "../ref-article/ref-article.js";

export const base = "/ref";
export const href = (m) => `${base}/${Number(m) === m ? m : m.ident}`;

export default [
  {
    path: `${base}/:ident`,
    component: "ref-article",
  },
];
