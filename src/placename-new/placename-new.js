// Data model
import { areas } from "../vocab/area.js";
const isValid = ({ name, area }) => {
  return name && name.length > 2 && area;
};
// Data services
import { put } from "../api/v2/placename/feature/put.js";
import { addPlacenameToCase } from "../api/v2/placename/add-remove-placename-from-case.js";
import { countryFromArea } from "../placename/schema2.js";

import { patch } from "@npolar/patch-event/src/exports.js";
//import { v2SearchURL as searchURLPlacenames } from "../placenames-search/search-url.js";

// Security
import { getRights, getEmail, isAuthorized } from "../store/user.js";

// UI
import { get as t } from "../translate/exports.js";
import baseStyle from "../base-element/style.js";
import { path } from "../placename/path.js";
import { goto } from "../goto.js";
import { statusIcon } from "../placename/config.js";
import { select } from "../placename-edit/select.js";

import { LitElement, html } from "lit-element";

export class PlacenameNew extends LitElement {
  static get properties() {
    return {
      feature: { type: Object }, // API v2 placename feature
      authorized: { type: Boolean },
    };
  }

  static get styles() {
    return [baseStyle];
  }

  connectedCallback() {
    super.connectedCallback();
    this.authorize();
  }

  async authorize() {
    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("create"),
    });
  }

  firstUpdated() {
    super.firstUpdated();
    this.feature = { name: undefined, area: undefined };

    this.addEventListener("@npolar/sign-in", ({ detail: { user } }) => {
      this.authorized = getRights({ user }).includes("create");
    });
  }

  async create() {
    const creator = await getEmail();
    const beginLifespanVersion = new Date().getFullYear();
    const country = countryFromArea(this.feature.area);
    this.feature = {
      ...this.feature,
      status: "draft",
      geometry: {
        coordinates: null,
        type: "Point",
      },
      "@language": "nn",
      created: new Date().toJSON(),
      creator,
      beginLifespanVersion,
      country,
      country_of_authority: "NO",
    };
    const { created } = await put(this.feature, { host: this });
    if (created) {
      const { id, cases } = created[0];
      this.feature = { ...this.feature, id };
      await put(this.feature, { host: this });
      if (cases && cases.length > 0) {
        const n = this.feature.cases[0]["@id"];
        addPlacenameToCase(n, { id });
      }
      goto(path({ id }));
    }
  }

  patch({ detail: { op, path, value } }) {
    this.feature = patch(this.feature, { op, path, value });
  }

  render() {
    const { feature, authorized, patch, create } = this;

    const { name, country, area, cases } = feature || {};

    const valid = isValid({ name, country, area });

    return html`
      <form class="mdc-typography--body1" @patch="${patch}">
        <card-mdc icon="edit" outlined>
          <div slot="header">
            <h1 class="mdc-typography--headline4">
              <button-icon
                role="presentation"
                label="${t(`status.${status}`)}"
                icon="${statusIcon(status)}"
              ></button-icon>
              <span> ${isValid({ name, area }) ? name : t("name.new")} </span>
            </h1>
          </div>
          <div class="edit-box">
            <input-text
              required
              validationMessage=${!valid
                ? `${t("any.min")} 3 ${t("any.characters")}`
                : ""}
              not-null
              path="/name"
              op="${!name ? "add" : "replace"}"
              value=${name ? name : ""}
              placeholder="${t("any.name")}"
              label="${t("any.name")}"
              outlined
              validateOnInitialRender
              rows="1"
              minlength="3"
              maxlength="256"
              @input=${({ target: { value } }) => {
                this.feature = { ...this.feature, name: value };
              }}
            >
            </input-text>
          </div>

          ${select("area", ["", ...areas], {
            value: feature ? feature.area : "",
            prefix: "area.",
            html,
            op: "add",
            required: true,
            t,
          })}

          <input-text
            value=${cases ? cases[0]["@id"] : ""}
            label="${t("case.number")}"
            outlined
            @input=${({ target: { value } }) => {
              const n = Number(value) > 0 ? parseInt(value) : undefined;
              const cases = n ? [{ "@id": n }] : undefined;
              this.feature = {
                ...this.feature,
                cases,
              };
            }}
          >
          </input-text>
          <button-fab
            ?hidden="${!authorized || !valid}"
            class="primary-fab"
            extended
            icon=${"add"}
            label=${t("name.new")}
            @click="${create}"
          >
          </button-fab>

          ${JSON.stringify(feature)}
        </card-mdc>
      </form>
    `;
  }
}
customElements.define("placename-new", PlacenameNew);
