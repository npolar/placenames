// data layer
import { findPlacenamesLinkingToCase } from "../api/v2/placename/feature/search.js";
import { patch } from "@npolar/patch-event/src/exports.js";

import { isValid as isValidJWT } from "@npolar/fetch-api/src/jwt.js";
import { isAuthorized } from "../store/user.js";

// ui
import { linkify } from "../html/linkify.js";
import { casePager } from "./case-pager.js";
import { linkedPlacenames } from "./linked-placenames.js";
import { get as t } from "../translate/exports.js";
import { longDate } from "./long-date.js";
import { path } from "../case/path.js";

import "../leaflet/world-imagery-map.js";
import { zoomForArea, centerForArea } from "../placename/config.js";

import baseStyle from "../base-element/style.js";
import style from "./style.js";

import "@npolar/mdc/src/text-area/exports.js";
import "@npolar/mdc/src/select/select-options.js";
import "@npolar/mdc/src/list/exports.js";
import "@npolar/mdc/src/button/exports.js";

// internals
import { caseUpdated } from "./case-updated.js";
import { caseProperties } from "./case-properties.js";
import { LitElement, html } from "lit-element";

export class CaseArticle extends LitElement {
  static get properties() {
    return caseProperties;
  }

  static get styles() {
    return [baseStyle, style];
  }

  async firstUpdated() {
    super.firstUpdated();

    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("update"),
    });

    // @todo case-article maps crashes on 157, 116, 175 (checked 1-200)?
    this.addEventListener("leaflet-map", async (e) => {
      const [sender] = e.composedPath();
      if (sender.id === "primary-map") {
        const { map } = e.detail;
        map.setMinZoom(3);
        map.setMaxZoom(13);
        this._map = map;
      }
    });

    this.addEventListener("patch", async ({ detail }) => {
      this.case = patch(this.case, detail);
    });

    this.patches = [];
    if (!this.number) {
      const {
        params: { number },
      } = this.location;

      if (number.length > 0) {
        this.number = number;
      }
    }
  }

  updated(p) {
    caseUpdated(p, this);
  }

  render() {
    if (!this.case) {
      return "";
    }
    const { title, area, protocol, comment, placenames, date } = this.case;
    const n = this.number;
    const year = new Date(date).getFullYear();
    const { editing, detected, authorized } = this;

    return html`
      <article class="mdc-typography--body1">
        <card-mdc>
          <div slot="header">
            <h1 class="mdc-typography--headline4">
              <button-icon icon="folder" role="presentation"></button-icon>
              <span>${title}</span>
                ${
                  authorized
                    ? html`
                        <button-icon
                          @click="${() => (this.editing = !editing)}"
                          icon="${editing !== true ? "edit" : "visibility"}"
                        ></button-icon>
                      `
                    : ""
                }
              </a>
            </h1>
            <h3 class="mdc-typography--headline5">
              ${casePager(n, { maxcase: n + 1, html, t })}
              <a
                href="/case/?date=${date}"
                title="Sjå alle saker frå dette møtet"
              >
                ${longDate(date, {
                  locales: this.lang,
                })}
              </a>
            </h3>
          </div>
        </card-mdc>

        ${
          (placenames && placenames.length > 0) ||
          (detected && detected.length > 0)
            ? html`
                <world-imagery-map
                  id="primary-map"
                  class="primary-map"
                  zoom=${zoomForArea(area)}
                  center="${centerForArea(area).reverse().join(",")}"
                >
                </world-imagery-map>
              `
            : ""
        }
        ${
          editing !== true
            ? html` <card-mdc>
                <p class="protocol">
                  ${linkify(protocol, {
                    list: detected,
                    area,
                    params: { area },
                  })}
                </p>
                <p class="protocol">${comment}</p>
              </card-mdc>`
            : html`<case-edit
                @patch="${this.onPatch}"
                .case=${this.case}
                .placenames=${placenames}
                .detected=${detected}
              ></case-edit>`
        }
        ${linkedPlacenames({
          host: this,
          area,
          placenames,
          authorized,
          case: this.case,
          number: this.case["@id"],
          detected,
          html,
          t,
        })}
        ${
          authorized && editing !== true
            ? html`
                <button-fab
                  @click="${() => (this.editing = !editing)}"
                  class="primary-fab"
                  extended
                  icon="edit"
                  label="${t("any.edit")}"
                >
                </button-fab>
              `
            : ""
        }
      </article>
    `;
  }

  afterPatch({ op, path, value, ...extra }) {
    this.requestUpdate();
  }
}
customElements.define("case-article", CaseArticle);
