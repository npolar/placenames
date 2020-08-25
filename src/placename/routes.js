//import "../placenames-home/placenames-home.js";
import "../placenames-search/placenames-search.js";
import "../placename-article/placename-article.js";
import "../placename-new/placename-new.js";
// import "../placename-edit/placename-edit.js";
// import "../placenames-duplicates/placenames-duplicates.js";

// if (isAreaDup({ name, area })) {
//   this.isAreaDup = true;
// } else {
//   feature = await get(name, { area, online: false });
// }

export default [
  {
    path: "/edit/:id",
    component: "placename-edit",
  },
  {
    path: "/new",
    component: "placename-new",
  },
  {
    path: "/nytt",
    component: "placename-new",
  },
  // {
  //   path: "/duplicates",
  //   component: "placenames-duplicates",
  // },
  {
    path: "/stadnamn/:name",
    component: "placename-article",
  },
  {
    path: "/stadnamn/:name/:area",
    component: "placename-article",
  },
  {
    path: "/stadnamn",
    redirect: "/",
  },

  {
    path: "/:name/:area/:id",
    component: "placename-article",
  },
  {
    path: "/:name/:area",
    component: "placename-article",
  },
  {
    path: "/:name",
    component: "placename-article",
  },
  // {
  //   path: "/",
  //   component: "placenames-search",
  // },
];

// Place names have URLs defined by their name
//
// Starting on 14 December 2011 the URLs had the following form
// * http://stadnamn.npolar.no/stadnamn/Longyearbyen
// * http://placenames.npolar.no/stadnamn/Longyearbyen?ident=8560 [English site, with optional ident]
//
// These URLs are still (as of January 2020) in heavy use, in particular by NRK and Wikipedia.
// See also: https://no.wikipedia.org/wiki/Stadnamn_i_norske_polaromr%C3%A5de
//
// From ca 2016 the placenames were served by a new domain – https://data.npolar.no/placename
// Requests to any of the legacy URLs were redirected to
// https://data.npolar.no/placename/Longyearbyen
// and then to
// https://data.npolar.no/placename/530b0e67-e6e9-510c-b8c9-4ae7bf77c541?name=Longyearbyen&area=Svalbard

// Wikidata has picked up the newer usage
//
// Norwegian Polar Institute place name ID
// identifier of a location in the Norwegian Polar Institute's "Place names in Norwegian polar areas" database
// Represents	Place names in Norwegian polar areas (Q23832085)
// Data type	External identifier
// Allowed values	[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}
// Example	Kjerulfbreen (Q16938787) → 732e9972-4393-50da-9f48-2fb1b591345e
// Glopeken (Q11972226) → 55b18732-3e2e-59f6-ad37-7c7670a458c9
// Rustad Knoll (Q7382410) → 93a30ddd-bb62-57db-a2ef-99ee11361d35
// Source	https://data.npolar.no/dataset/a2813eb6-e866-4ef7-8808-ed09eb1566c5
// Formatter URL	https://data.npolar.no/placename/$1
// Formatter URN	urn:uuid:$1 — List of Uniform Resource Names (URN)
// Tracking: usage	Category:Pages using Wikidata property P5391 (Q55235445)
// Related to country	Flag of Norway.svg Norway (Q20) (See 48 others)
// See also	SCAR Composite Gazetteer place ID (P3230)
// https://www.wikidata.org/wiki/Property:P5391
//
// Wikidata enrich the data by adding named_after, glacier id from glims, geonames id, etc,
// https://www.wikidata.org/wiki/Q16938787
