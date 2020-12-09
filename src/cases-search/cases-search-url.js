import { _search } from "../api/v2/placename/case/search.js";
import { endpoint } from "../api/v2/placename/case/endpoint.js";

export const casesSearchURL = ({
  endpoint,
  sort,
  q,
  filters,
  not,
  ...params
} = {}) => {
  const v2url = new URL(_search);

  const v2params = v2url.searchParams;

  // Special treatment of number-only search, because ATM free text search for numbers is severely non-functional...
  if (Number.isInteger(Number(q)) && Number(q) > 0 && q.length < 5) {
    // Year
    if (
      q.length === 4 &&
      Number(q) >= 1980 &&
      Number(q) <= new Date().getFullYear() + 1
    ) {
      v2params.set("and", `date:${q}..${Number(q) + 1}`);
    } else if (q.length < 4) {
      // Case number
      v2params.set("and", `@id:${q}`);
    }
  } else {
    v2params.set("q", q);
  }

  // v2params.set("facet", "area"); // FIXME Faceting does not work!?
  
  for (const [k, v] of filters) {
    console.log(k,v)
    v2params.append("and", `${k}:${v}`)
  }
  if (sort) {
    const sortfield = sort.replace("-", "");
    const sortdir = sort === sortfield ? "asc" : "desc";
    v2params.set("sort", `${sortfield}:${sortdir}`);
  }

  //v2params.set("hide", "text,comment,created,updated,editor,version");
  return v2url.href;
};
