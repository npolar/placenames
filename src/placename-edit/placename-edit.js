// Data model
import { areas } from "../vocab/area.js";

import { countryFromArea } from "../placename/schema2.js";

const languagesForSpelling = [
  "",
  "nn",
  "nb",
  "en",
  "sv",
  "is",
  "fr",
  "nl",
  "ru",
].sort();
const EDITING = "editing";
const SAVING = "saving";
const SAVED = "saved";
//const INVALID = "invalid";
const FAILED = "failed";

// Data services
import { addPlacenameToCase } from "../api/v2/placename/add-remove-placename-from-case.js";
// Security
import { getEmail, getRights, isAuthorized } from "../store/user.js";

import { html, LitElement } from "lit-element";
import { get as g, get as t } from "../translate/exports.js";

import { factsEdit } from "./facts.js";
import { linkedCase } from "./linked-case.js";
import { linkedName } from "./linked-name.js";
import { linkedReference } from "./linked-reference.js";

import { arrayEdit } from "./array-edit.js";
import { select } from "./select.js";

import { h4 } from "@npolar/mdc/src/h.js";
import style from "./style";
import baseStyle from "../base-element/style.js";

import {
  register,
  patch,
  value as pointerValue,
} from "@npolar/patch-event/src/exports.js";

import { path } from "../placename/path.js";

import { get } from "../api/v2/placename/feature/get.js";
import { put } from "../api/v2/placename/feature/put.js";

// UI
import "@npolar/mdc/src/text-area/exports.js";
import "@npolar/mdc/src/button/exports.js";

import { statusIcon } from "../placename/config.js";

import { textareasCard } from "./textareas-card.js";

export class PlacenameEdit extends LitElement {
  static get styles() {
    return [baseStyle, style];
  }

  static get properties() {
    return {
      feature: { type: Object },
      editStatus: { type: String },
      name: { type: String },
      area: { type: String },
      status: { type: String },
      editor: { type: String },
      lang: { type: String },
      valid: { type: Boolean },
      authorized: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.feature = {};
  }

  async authorize() {
    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("update"),
    });
  }

  async save() {
    this.editStatus = SAVING;
    const { feature } = this;
    feature.updated = new Date().toJSON();

    feature.editor = await getEmail();
    const { updated } = await put(feature, { host: this });
    if (updated) {
      this.editStatus = SAVED;
      const { name, id, area, status, beginLifespanVersion, cases } = feature;
      cases.map((c) =>
        addPlacenameToCase(
          c,
          { name, id, area, status, beginLifespanVersion, cases },
          { host: this }
        )
      );
    } else {
      this.editStatus = FAILED;
    }
    console.warn("save", feature, this.editStatus);
  }

  firstUpdated() {
    super.firstUpdated();
    this.authorize();
    this.addEventListener("@npolar/sign-in", ({ detail: { user } }) => {
      this.authorized = getRights({ user }).includes("update");
    });
    const form = this.renderRoot.querySelector("form");
    register(form, (e) => this.patch(e.detail), {
      eventTypes: ["input", "change"],
    });
    this.addEventListener("click", () => {
      this.editStatus = EDITING;
    });

    const { params } = this.location;
    const { id } = params;

    if (id) {
      this.load(id);
    }
  }

  async patch({ op, path, value, from, extra }) {
    const { feature } = this;

    const prev = pointerValue(feature, path);
    if (op === "replace" && undefined === prev) {
      op = "add";
    }

    let reallyPatch = ["remove"].includes(op) || value !== prev;
    if (extra && "number" === extra.inputType && Number.isNaN(value)) {
      reallyPatch = false;
    }

    if (reallyPatch) {
      //console.log({ op, path, value, from, extra, feature });
      let patched = patch(feature, { op, path, value, from });

      // Country from area
      const { area, name } = patched;
      if (path === "/area") {
        patched.country = countryFromArea(area);
      }

      this.name = name;
      this.feature = patched;

      this.save();
    }
  }

  async load(id, { jwt } = {}) {
    const feature = await get({ id, jwt, host: this });

    const { definition, origin, note, cases } = feature;
    const lang2 = { nn: undefined, en: undefined };
    if (!definition) {
      feature.definition = { ...lang2 };
    }
    if (!origin) {
      feature.origin = { ...lang2 };
    }
    if (!note) {
      feature.note = { ...lang2 };
    }
    if (cases && cases instanceof Array) {
      feature.cases = cases.sort((a, b) => a["@id"] - b["@id"]);
    } else {
      feature.cases = [];
    }

    feature.geometry =
      feature.geometry &&
      feature.geometry.coordinates &&
      feature.geometry.coordinates.length
        ? feature.geometry
        : { type: "Point", coordinates: [0, 0, 0] };

    this.feature = { ...feature };
    this.name = feature.name;

    this.requestUpdate();
  }

  render() {
    const { feature, name, put, authorized, editStatus } = this;

    let {
      //id,
      //area,
      status,
      //country,
      cases,
      replaces,
      replaced_by,
      //definition,
      geometry,
      proposer,
      references,
      // created,
      // created_by,
      // updated,
      // updated_by,
      // properties,
    } = feature || {};

    document.querySelector("title").textContent = t("any.editing") + " " + name;

    if (undefined === geometry) {
      geometry = { type: "Point", coordinates: [0, 0, 0] };
    }
    const { coordinates } = geometry;
    const geometryType = geometry.type;

    return html`
      <form class="mdc-typography">
        <card-mdc>
          <div slot="header">
            <h1 class="mdc-typography--headline4">
              <button-icon icon="${statusIcon(status)}" role="presentation">
              </button-icon>
              ${name}
            </h1>
          </div>
        </card-mdc>

        <card-mdc outlined>
          <fieldset class="input">
            <legend slot="header">
              ${h4(g("name.placename"), { html })}
            </legend>
            <input-text
              required
              outlined
              path="/name"
              label=${t("name.name")}
              not-null
              minlength="3"
              maxlength="64"
              .value=${name && name.length ? name : ""}
            ></input-text>

            ${select("area", ["", ...areas], {
              value: feature ? feature.area : "",
              prefix: "area.",
              html,
              t,
            })}
            ${select("@language", languagesForSpelling, {
              value: feature ? feature["@language"] : "",
              prefix: "lang.",
              html,
              t,
            })}
          </fieldset>
        </card-mdc>

        ${factsEdit({ feature, html, t, host: this })}
        ${["definition", "origin", "note"].map((field) =>
          textareasCard(field, { feature, t, html })
        )}

        <card-mdc outlined>
          <fieldset class="input">
            <legend slot="header">
              ${h4(t("name.history"), { html })}
            </legend>

            <input-number
              required
              outlined
              type="number"
              min="1000"
              max="2100"
              label="${t("name.beginLifespanVersion")}"
              placeholder="${t("name.year_this_spelling_was_first_used")}"
              value=${feature.beginLifespanVersion}
              path="/beginLifespanVersion"
              icon="history"
            >
            </input-number>

            <input-number
              outlined
              min="1000"
              max="2100"
              label="${t("name.endLifespanVersion")}"
              placeholder="${t("name.year_this_spelling_was_last_used")}"
              value=${feature.endLifespanVersion}
              path="/endLifespanVersion"
              icon="history"
            >
            </input-number>

            <input-mdc
              outlined
              .value=${proposer && proposer.length ? proposer : ""}
              label=${t("name.proposer")}
              path="/proposer"
            >
            </input-mdc>
          </fieldset>
        </card-mdc>

        ${arrayEdit({
          edit: linkedCase,
          headline: t("case.cases"),
          collection: cases,
          path: "/cases",
          label: t("case.number"),
          valuePathSuffix: "/@id",
          extractValue: (c) => c["@id"],
          create: () => ({ "@id": 0 }),
          host: this,
          html,
          t,
        })}
        ${arrayEdit({
          edit: linkedName,
          headline: t("name.replaces"),
          collection: replaces,
          path: "/replaces",
          label: t("name.name"),
          valuePathSuffix: "/name",
          extractValue: (c) => {
            return c.name;
          },
          create: () => ({ "@id": "", name: "" }),
          host: this,
          html,
          t,
        })}
        ${arrayEdit({
          edit: linkedName,
          headline: t("name.replaced_by"),
          collection: replaced_by,
          path: "/replaced_by",
          label: t("name.replaced_by"),
          valuePathSuffix: "/name",
          extractValue: (c) => {
            return c.name;
          },
          create: () => ({ "@id": "", name: "" }),
          host: this,
          html,
          t,
        })}
        ${arrayEdit({
          edit: linkedName,
          headline: t("name.same_as"),
          collection: feature.same_as,
          path: "/same_as",
          valuePathSuffix: "/name",
          extractValue: (c) => {
            return c.name;
          },
          create: () => ({ "@id": "", name: "" }),
          host: this,
          html,
          t,
        })}
        ${arrayEdit({
          edit: linkedReference,
          headline: t("ref.references"),
          collection: references,
          path: "/references",
          label: t("name.replaced_by"),
          valuePathSuffix: "/name",
          extractValue: (c) => {
            return c.title;
          },
          create: () => ({ title: "", ident: 0 }),
          host: this,
          html,
          t,
        })}

        <card-mdc outlined>
          <fieldset class="input">
            <legend slot="header">
              ${h4(t(`geo.${geometryType}`), { html })} ${t("geo.coordinates")}
            </legend>
            ${"Point" === geometryType
              ? html` <input-number
                    type="number"
                    min="-180"
                    max="180"
                    step="0.000001"
                    label="${t("geo.longitude")}"
                    value=${coordinates[0]}
                    path="/geometry/coordinates/0"
                  ></input-number>
                  <mwc-textfield
                    type="number"
                    min="-90"
                    max="90"
                    step="0.000001"
                    label="${t("geo.latitude")}"
                    value=${+coordinates[1]}
                    outlined
                    op=""
                    path="/geometry/coordinates/1"
                  >
                  </mwc-textfield>
                  <input-mdc
                    outlined
                    type="number"
                    max="9000"
                    step="1"
                    label="${t("geo.altitude")}"
                    value=${coordinates[2]}
                    path="/geometry/coordinates/2"
                  >
                  </input-mdc>`
              : ""}
          </fieldset>
        </card-mdc>
      </form>
      ${editStatus && editStatus !== EDITING
        ? html` <div class="left-fab">
            <button-fab
              disabled
              mini
              class="${[FAILED].includes(editStatus) ? "error" : ""}"
              @click=${put}
              extended
              icon="${editStatus === EDITING ? "edit" : "cloud_upload"} "
              label="${editStatus ? t(`edit-status.${editStatus}`) : ""}"
            ></button-fab>
          </div>`
        : ""}
      ${authorized
        ? html` <a class="primary-fab" href="${path(feature)}">
            <button-fab
              label="sjå"
              mini
              extended
              icon="visibility"
              label="${t("any.vis")}"
            ></button-fab>
          </a>`
        : ""}
    `;
  }
}
customElements.define("placename-edit", PlacenameEdit);
