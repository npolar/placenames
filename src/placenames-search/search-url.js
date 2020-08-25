import { _search } from "../api/v2/placename/feature/search.js";
import { searchURL } from "@npolar/fetch-api/src/v1/exports.js";
import v1PlacenameEndpoint from "../api/v1/placename/endpoint.js";
import { endpoint } from "../api/v2/placename/feature/endpoint.js";

export const v1SearchURL = ({
  endpoint = v1PlacenameEndpoint,
  filters,
  not,
  ...params
} = {}) => {
  return searchURL({
    endpoint,
    limit: 25,
    not,
    filters,
    ...params,
    variant: "feed",
    facets: "area,status",
    fields: "name,_id,status,area,relations,created,properties",
  });
};

export const v2SearchURL = ({
  endpoint,
  q,
  filters,
  not,
  sort,

  ...params
} = {}) => {
  const url = new URL(_search);
  const v2params = url.searchParams;
  v2params.set("q", q);

  // @todo Remove start/limit (add to ignore params)
  const start = filters.has("start") ? filters.get("start") : 0;
  filters.delete("start");
  const limit = filters.has("limit") ? filters.get("limit") : 25;
  filters.delete("limit");

  v2params.set("page", `${start}..${limit}`);
  v2params.set("facet", "area,status");
  v2params.set("show", "name,id,area,status,beginLifespanVersion,replaced_by");

  for (const [k, v] of filters) {
    v2params.append("and", `${k}:${v}`);
  }
  if (sort) {
    const sortfield = sort.replace(/-/g, "");
    const sortdir = sort === sortfield ? "asc" : "desc";
    v2params.set("sort", `${sortfield}:${sortdir}`);
  }
  return url.href;
};
