// Security
import { getRights, isAuthorized, getUserLang } from "../store/user.js";

import { emit } from "@npolar/mdc/src/host/event.js";
import {
  base,
  request,
  searchURL as apiV1SearchURL,
} from "@npolar/fetch-api/src/v1/exports.js";

import { areaDuplicateWarning } from "./area-duplicate-warning.js";
import { historicalWarning } from "./historical-warning.js";

// data layer
//import v2SearchURL from "../placenames-search/search-url.js";
import { findID } from "../api/v2/placename/feature/search.js";
import { fetchByIDs } from "../api/v2/placename/feature/search.js";
import { get as getRef } from "../ref/get.js";

import "@npolar/mdc/src/card/exports.js";
import "@npolar/mdc/src/list/exports.js";

// @todo placename-article detect island group
// import { groups } from "../geometry/svalbard/group-by-areas.js";
import { DML } from "../vocab/area.js";
import { facts } from "../placename/facts.js";

// process
import { detect } from "../placename/detect.js";

import { path as casePath } from "../case/service.js";

//import { setTitle } from "../base-element/base-element.js";

import sharedStyle from "../base-element/style.js";

//import "@npolar/mdc/src/list/ol.js";
import {
  extractParams,
  decode,
  path,
  placenameStream,
  isAreaDup,
} from "../placename/exports.js";
import { endpoint } from "../api/v2/placename/feature/endpoint.js";
import { get as getByID } from "../api/v2/get.js";

import { getIdents } from "../placename/dupl.js";

import style from "./style.js";
import { empty, links } from "../html/list.js";

import { h2 } from "../html/h.js";
import { linkify, mark } from "../html/linkify.js";

import { LitElement, html } from "lit-element";

import {
  changeLang,
  isNorwegian,
  prefer,
  get as t,
} from "../translate/exports.js";

import "../leaflet/world-imagery-map.js";
import { addFeatureGroupToMap } from "../leaflet/add-feature-group.js";
import { PlacenamesSchema2 as schema } from "../placename/schema2.js";
const { stringify } = JSON;
const { keys, entries } = Object;

import { applyPatch } from "@npolar/patch-event/src/rfc6902/index.js";

import { featureGroup as createFeatureGroup } from "leaflet/dist/leaflet-src.esm.js";
import { statusIcon, zoomForArea, circleSize } from "../placename/config.js";
import { yearPager } from "./year-pager";
// Since lang starts undefined, initial display is fallback ie. en
const _fallbackLang = (lang) => {
  return lang === "en" ? "nn" : "en";
};

const _getText = (o, lang, fallback = _fallbackLang(lang)) => {
  if (o && keys(o).length > 0) {
    if (o && o[lang]) {
      return o[lang];
    }
    if (o[fallback]) {
      return o[fallback];
    }
    return "";
  } else {
    return "";
  }
};

const warnDup = (heading, { duplicates = [] } = {}) => html`
  <card-mdc>
    <div slot="header">
      ${h3(heading, { icon: "error" })}
    </div>
    ${stringify(duplicates)}
  </card-mdc>
`;

const problemCard = ({
  heading,
  problems = [],
  icon = "error",
  mapper,
} = {}) => html`
  <card-mdc>
    <div slot="header">
      ${h3(heading, { icon })}
    </div>
    ${stringify(problems)}
  </card-mdc>
`;

// Duplicates are tricky. Take "Salen", for instance: Occurs in SV, JM, P1 and DML, but is not a duplicate.

// Support Svalbard official names (URL path is /{name}): "/Svea", "/Pyramiden"
// OK "Pyramiden/Svalbard"
// Support legacy URLs with ident parameter: "/Pyramiden?ident=11653"
// Also support: /Pyramiden/Svalbard?ident=11653

// }
// Support: /Pyramiden/Dronning_Maud_Land
// else if (this.isDup && area) {
//   console.log(this.duplicates);
//   const key = `/${id}/${area}`;
//   feature = await getDup(key);
//   console.log("isDup", { id, area });
// }

// Support: /Krakken?ident=901163
// The area is needed to construct the key, but is not part of the URL.
// Morover, a blank area with ident may not mean Svalbar
// Since we maintain a list of duplicates per area, and the only areas with duplicates are SV and DML, we can deduce
// if (!feature && ident) {
//   const key2 = `/${id}/${isAreaDup(id, DML) ? DML : SV}/${ident}`;
//   const f2 = await getDup(key2);
//   if (f2) {
//     feature = f2;
//   }
// }

// Support "/Krakken" "/Svea" "/Nordenski%C3%B6ld_Land_nasjonalpark"
// Lookup duplicates like "/Krakken/Dronning_Maud_Land" "/Pyramiden"
export class PlacenameArticle extends LitElement {
  static get styles() {
    return [sharedStyle, style];
  }
  static get properties() {
    return {
      feature: { type: Object }, // API v2 placename feature
      cases: { type: Array }, // API v2 cases
      params: { type: Object },
      lang: { type: String, reflect: true },
      name: { type: String },
      area: { type: String },
      href: { type: String },
      authorized: { type: Boolean },
      replaces: { type: Array },
      duplicates: { type: Array },
      detected: { type: Array },
    };
  }

  constructor() {
    super();
    this.lang = getUserLang();

    window.addEventListener(
      "@npolar/lang",
      ({ detail: { lang } }) => (this.lang = lang)
    );

    this.addEventListener("leaflet-map", async (e) => {
      const [sender] = e.composedPath();

      if (sender.id === "primary-map") {
        const { map } = e.detail;
        this._map = map;
        // @todo PlacenameArticle restrict max zoom level if offline
        map.setMinZoom(3);
        map.setMaxZoom(13);
        const features = [await this.feature];

        if (features.length > 0) {
          const featureGroup = createFeatureGroup();
          addFeatureGroupToMap({
            features,
            featureGroup,
            name: this.feature.name,
            map,
            options: { color: "red", radius: 16 },
          });
        }
      }
    });
  }

  async authorize() {
    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("update"),
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    this.authorize();
    let { online } = this;

    const params = extractParams({
      vaadinRouterLocation: this.location, // Path params in this.location are injected by vaadin-router
      searchParams: new URLSearchParams(window.location.search),
    });
    let { id, name, area, ident } = params; // @todo validate area

    if (!id) {
      id = await findID({ name, area, ident });
    }
    this.params = params;

    this.isAreaDuplicate = isAreaDup({ name, area });
    // wont trigger for /Pyramiden since area is not set in URL

    if (this.isDuplicate && !id) {
      const duplicates = await Promise.all(
        getIdents({ name, area }).map((ident) => get(name, { area, ident }))
      );
      this.duplicates = duplicates;
    } else {
      // const response = await request({
      //   path: `${endpoint}/${id}`,
      //   base,
      //   area,
      //   ident,
      //   online,
      // });
      const v1 = await getByID({ id, endpoint, host: this });

      const host = this;
      const { lang } = this;
      const feature = v1;
      const href = "/" + feature.id; //decode(path(feature));
      this.href = href;

      const { name, area, country, cases, textlinks, properties } = feature;
      this.isAreaDuplicate = isAreaDup({ name, area });
      const title = `${name} – ${area}, ${country}`;
      emit({
        host,
        name: "@npolar/title",
        detail: { title },
      });
      // todo inject link rel canonical into head
      // <link rel="canonical" href="https://example.com/dresses/green-dresses" />
      // emit({
      //   host,
      //   name: "@npolar/app-bar",
      //   detail: { heading: name, lang, endpoint },
      // });

      //@todo setTitle(`${name} – ${area}`);

      //const propertiesgroups = ;
      feature.properties = { ...properties }; //@crit ...groups(feature)

      this.feature = feature;
      this.cases = cases; //@crit await Promise.all(cases.map(c => caseStore.get(c["@id"])));
      //this.requestUpdate();

      // console.time();
      // const a = (await placenameStore.all())
      //   .map(p => p.name["@value"])
      //   .sort()
      //   .filter(p => !/^([A-ZÆØČÅÉÖÄŠŚŽŁÜ]|g\.\s|gor|nun|pik|ledn)/u.test(p));
      // console.log(new Set(a));
      // console.timeEnd();

      if (!this.detected) {
        this.detect();
      }
    }
  }

  async detect() {
    const { feature } = this;
    const { origin, definition, note, area } = await feature;
    const text = JSON.stringify({ origin, definition, note }).replace(
      /[\{\}"]/g,
      ""
    );

    const features = (await detect(text, { area, dereference: true })).filter(
      ({ id }) => id !== feature.id
    );
    if (features.length > 0) {
      this.feature.textlinks = features.map(({ name }) => name);
      this.detected = features;
      this.requestUpdate();
      if (this._map) {
        addFeatureGroupToMap({
          map: this._map,
          features,
          name: t(`name.mentioned`),
          options: { color: "rgb(0, 109, 179)", radius: 8 },
        });
      } else {
        console.warn(
          "@todo map is not created when name is unofficial like Tor/Svalbard..., so mentioned names are not shown"
        );
      }
    }
  }

  async updated(p) {
    super.updated(p);
    if (p.has("feature")) {
      let { replaces, replaced_by, same_as } = this.feature;
      const idsReplaced = (replaces || []).map((p) => p["@id"]);
      if (idsReplaced && idsReplaced.length > 0) {
        const r = fetchByIDs(idsReplaced).then((replaces) => {
          // Remove internal references for historical names
          // {"content":"Place-Names of Svalbard","ident":1158}
          // {"content":"Supplement I to The Place-Names of Svalbard dealing with new names 1935-55","ident":1159}
          // {"content":"Place Names of Jan Mayen","ident":1160}
          // {"content":"Namnekomitéen, Norsk Polarinstitutt. Kartotek / Card file","ident":1161}
          // {"content":"Namnekomitéen, Norsk Polarinstitutt. Saksmappe / Dossier","ident":1162}
          // {"content":"Place-names of Heimefrontfjella and Lingetoppane, Dronning Maud Land, Antarctica","ident":1163}
          // {"content":"Rapportserie 122","ident":1164}
          replaces = replaces.map((p) => {
            p.references = (p.references || []).filter(
              (r) => ![1158, 1159, 1160, 1161, 1162].includes(r.ident)
            );
            return p;
          });
          this.replaces = replaces;
        });
      }

      const newerIDs = (replaced_by || []).map((p) => p["@id"]);
      if (newerIDs && newerIDs.length > 0) {
        this.feature.replaced_by = await fetchByIDs(newerIDs);
      }

      const sameAsIDs = (same_as || []).map((p) => p["@id"]);
      if (sameAsIDs && sameAsIDs.length > 0) {
        this.feature.same_as = await fetchByIDs(sameAsIDs);
      }

      if (!this.feature.endLifespanVersion && this.feature.replaced_by) {
        const endLifespanVersionSet = new Set(
          this.feature.replaced_by
            .filter((r) => r.beginLifespanVersion)
            .map((r) => {
              return r.beginLifespanVersion;
            })
        );
        if (endLifespanVersionSet.size > 0) {
          const { beginLifespanVersion } = this.feature;
          const endLifespanVersion = [...endLifespanVersionSet].sort().pop();
          if (endLifespanVersion > beginLifespanVersion) {
            this.feature.endLifespanVersion = endLifespanVersion;
          }
        }
      }
      this.requestUpdate();
    }
  }

  render() {
    const {
      feature,
      replaces,
      params,
      lang,
      isDuplicate,
      isAreaDuplicate,
      duplicates,
      notFound,
      authorized,
    } = this;
    const casesFromStore = this.cases;
    if (!feature) {
      return;
    }
    const { id, status } = feature;

    const dupWarning = isDuplicate;

    if (feature) {
      let {
        id,
        name,
        area,
        ident,
        country,
        country_of_authority,
        first,
        geometry,
        terrain,
        properties,
        cases,
        references,

        replaced_by,
        same_as,
        status,
        texts,
        ...placename
      } = feature;

      const {
        definition,
        origin,
        note,
        beginLifespanVersion,
        endLifespanVersion,
      } = feature;

      const { year, use, decade, century } = first;
      let coordinates = [0, 0];
      if (geometry && geometry.coordinates) {
        coordinates = geometry.coordinates; //@todo if Point
      }
      const [lng, lat] = coordinates; //@todo if Point
      const textlinks = [...(feature.textlinks || []), area];

      const dfn = _getText(definition, lang);
      const ori = _getText(origin, lang);
      const notice = _getText(note, lang);
      const ter = _getText(terrain, lang);

      const textLanguages = Object.keys({ ...definition, ...origin, ...note });

      const { majorisland } = properties;

      return html`
        <article class="mdc-typography--body1">
          <card-mdc>
            <div slot="header">
              <h1 class="mdc-typography--headline4">
                <a>
                  <button-icon
                    role="presentation"
                    label="${t(`status.${status}`)}"
                    icon="${statusIcon(status)}"
                  ></button-icon>
                  <span> ${name} </span>
                  ${authorized
                    ? html`<a href="/edit/${id}">
                        <button-icon
                          label="${t(`status.${status}`)}"
                          icon="edit"
                        ></button-icon>
                      </a>`
                    : ""}
                </a>
              </h1>
            </div>
            <h3 class="mdc-typography--headline5">
              <a title="${area}" href="/?area=${area}">
                ${area}
              </a>
              ${yearPager({ beginLifespanVersion, html, t })}
              ${("AQ" === country || DML === area) &&
              country_of_authority &&
              country_of_authority.length === 2
                ? html`&nbsp;
                    <a href="/?country_of_authority=${country_of_authority}">
                      <img
                        alt="${t("name.Origin")}: ${t(
                          `country.${country_of_authority}`
                        )}"
                        title="${t("name.Origin")}: ${t(
                          `country.${country_of_authority}`
                        )}"
                        src="https://www.countryflags.io/${country_of_authority.toLowerCase()}/flat/32.png"
                      />
                    </a>`
                : ""}
            </h3>

            ${isAreaDuplicate
              ? areaDuplicateWarning({ name, area, replaced_by, html, t })
              : ""}
            ${"historical" === status
              ? html`${historicalWarning(
                  {
                    name,
                    area,
                    status,
                    beginLifespanVersion,
                    endLifespanVersion,
                    replaces,
                    replaced_by,
                  },
                  { t, html }
                )}`
              : ""}
            ${replaced_by && replaced_by.length > 0
              ? html`${h2(t("name.Replaced_by"), {})}<list-twoline
                    .entries=${replaced_by.map((p) => [
                      p.name,
                      p.beginLifespanVersion,
                      { icon: "place", href: path(p) },
                    ])}
                  >
                  </list-twoline>`
              : ""}
            ${dfn && dfn.length > 0
              ? html`<p>
                  ${linkify(dfn, {
                    list: textlinks,
                    area,
                    params: { area },
                  })}
                </p>`
              : ""}
            ${ori && ori.length > 0
              ? html` <p>
                  ${linkify(ori, {
                    list: textlinks,
                    area,
                    params: { area },
                  })}
                </p>`
              : ""}
            ${notice && notice.length > 0
              ? html`
                  <p>
                    <!--${h2(t("name.Note"), { icon: "text_fields" })}-->
                    ${linkify(notice, { list: textlinks, area, href: path })}
                  </p>
                `
              : ""}
          </card-mdc>

          ${lat !== 0 && lng !== 0
            ? html`
                <world-imagery-map
                  id="primary-map"
                  class="primary-map"
                  center="${lat},${lng}"
                  zoom=${zoomForArea(area)}
                >
                </world-imagery-map>
                <div></div>
              `
            : ""}
          ${cases && cases.length > 0
            ? html` <card-mdc>
                ${h2(t("case.Cases"))}
                <list-twoline
                  .entries=${(this.cases || cases).map((c) => [
                    `${t("case.case")} ${c["@id"]} ${
                      c.date ? `– ` + c.date : ""
                    }`,
                    c.title || `${t("case.Case")} ${c["@id"]}`,
                    { icon: "folder", href: casePath(c) },
                  ])}
                  lang="${lang}"
                >
                </list-twoline>
              </card-mdc>`
            : ""}
          ${replaces && replaces.length > 0
            ? html`<card-mdc>
                ${h2(t("name.Replaces"))}
                <list-twoline
                  .entries=${(replaces || feature.replaces || [])
                    .map((p) => [
                      p.name || p.id,
                      (p.references || []).map((r) => r.title).join(", "),
                      { icon: "history", href: path(p) },
                    ])
                    .sort((a, b) => new Intl.Collator("no").compare(a, b))}
                  lang="${lang}"
                >
                </list-twoline>
              </card-mdc>`
            : ""}
          ${same_as && same_as.length > 0
            ? html`<card-mdc>
                ${h2(t("name.Same_as"))}
                <list-twoline
                  .entries=${(same_as || []).map((p) => [
                    p.name,
                    `${t("name.Origin")}: ${t(
                      "country." + p.country_of_authority
                    )} ${p.beginLifespanVersion || ""}`,
                    {
                      icon: "place",
                      href: path({ name: p.name, area: p.area, id: p.id }),
                    },
                  ])}
                  lang="${lang}"
                >
                </list-twoline
              ></card-mdc>`
            : ""}
          ${references && references.length
            ? html`<card-mdc>
                ${h2(t("ref.References"))}
                <list-twoline
                  .entries=${(references || []).map((r) => [
                    getRef(r.ident).title,
                    getRef(r.ident).content || getRef(r.ident).year || "",
                    { icon: "account_balance", href: `/?q=${r.title}` },
                  ])}
                  lang="${lang}"
                >
                </list-twoline
              ></card-mdc>`
            : ""}
          ${this.detected && this.detected.length
            ? html`<card-mdc>
                ${h2(t("name.Placenames") + " " + t("name.mentioned"))}
                <list-twoline
                  .entries="${(this.detected || []).map((p) => [
                    p.name,
                    p.beginLifespanVersion,
                    {
                      href: path(p),
                      icon: statusIcon({ status }),
                    },
                  ])}"
                ></list-twoline>
              </card-mdc>`
            : ""}

          <card-mdc>
            ${h2(t("name.Facts"))}
            <list-twoline .entries=${facts(feature, { lang })} lang="${lang}">
            </list-twoline>
          </card-mdc>
        </article>

        ${authorized
          ? html`<a href="/edit/${id}">
              <button-fab
                class="primary-fab"
                extended
                icon="edit"
                label="${t("any.edit")}"
              >
              </button-fab>
            </a>`
          : ""}
      `;
    }
  }
}
customElements.define("placename-article", PlacenameArticle);
// @todo Share/Cite/License
// ${h2(t("cite.Citation"), { icon: "format_quote" })}
