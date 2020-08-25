// @todo case 306, "AQ" => no detection
// add searchbox to filter down name-lists... when edit...
// 1 linked name has wrong area! http://localhost:1596/case/306?sort=-beginLifespanVersion
// https://v2-api.npolar.no/placename/feature/cd8d22b4-c22b-5df4-8ad2-23d0783ec024
// "utgår" i 305
// Feilmerka i http://localhost:1596/Nordre_Helvetesflyvatnet/Svalbard/cd8d22b4-c22b-5df4-8ad2-23d0783ec024
// data services
// For å koble sak og namn tenkte eg å bygge på denne magien, slik at forslag til kobling dukker opp.​

import { findCaseByID } from "../api/v2/placename/case/search.js";

import { newCase } from "../api/v2/placename/case/new.js";
import { put } from "../api/v2/placename/case/put.js";

import { findPlacenamesLinkingToCase } from "../api/v2/placename/feature/search.js";
import { icon as placenameIcon } from "../placename/icon.js";

import { getJWTIfValid, isAuthorized } from "../store/user.js";

// UI
import { linkedName } from "../placename-edit/linked-name.js";
import { get as t } from "../translate/exports.js";
import { areas } from "../vocab/area.js";
import { get as g } from "../translate/exports.js";
import { linkedPlacenames } from "../case-article/linked-placenames.js";
import baseStyle from "../base-element/style.js";
import style from "./style.js";
import { path } from "../case/path.js";
import { goto } from "../goto.js";

import "@npolar/mdc/src/text-area/exports.js";
import "@npolar/mdc/src/select/select-options.js";
import "@npolar/mdc/src/list/exports.js";
import "@npolar/mdc/src/dialog/exports.js";

// internals
import { emit } from "@npolar/mdc/src/host/event.js";
import { register, patch } from "@npolar/patch-event/src/exports.js";
import { caseUpdated } from "../case-article/case-updated.js";
import { caseProperties } from "../case-article/case-properties.js";

import { LitElement, html } from "lit-element";
import { v2SearchURL as searchURLPlacenames } from "../placenames-search/search-url.js";

const renderPlacenameResults = ({ entries = [], html, t }) =>
  html`<mwc-list
    @selected="${placenameSelected}"
    @action="${placenameSelected}"
  >
    ${entries.map(
      (p) =>
        html`<mwc-list-item graphic="icon">
          <ic-on slot="graphic" icon="${placenameIcon(p)}"></ic-on>
          ${p.name}
        </mwc-list-item>`
    )}
  </mwc-list>`;

export class CaseEdit extends LitElement {
  static get properties() {
    return caseProperties;
  }

  static get styles() {
    return [baseStyle, style];
  }

  async connectedCallback() {
    this.patches = new Map();

    super.connectedCallback();

    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("update"),
    });

    if (!this.number) {
      // Handle injection by by Vaadin router that sets number in this.location
      if (this.location) {
        const {
          params: { number },
        } = this.location;
        if (number) {
          this.number = number;
        } else {
          this.setNewCase();
        }
      }
    }
  }

  firstUpdated() {
    super.firstUpdated();
    this.registerPatchHandlers();
  }

  async setNewCase() {
    this.case = await newCase();
  }

  registerPatchHandlers() {
    const eventTypes = ["input", "change"];
    register(
      this.renderRoot.querySelector("#case"),
      (e) => this.patchCase(e.detail),
      { eventTypes }
    );
  }

  updated(p) {
    caseUpdated(p, this);
  }

  async load(id) {
    this.case = await findCaseByID(id);
  }

  async patchCase(operation) {
    const { number } = this;
    const uuid = this.case && this.case.id ? this.case.id : undefined;
    const jwt = await getJWTIfValid();
    const iri = `https://v2-api.npolar.no/placename/case/${number}`;
    const patched = patch(this.case, operation);
    this.case = patched;

    const { created } = await put(this.case, { jwt, host: this });
    if (created) {
      const { id, modified, owner } = created[0];
      patched.id = id;
      patched.creator = owner;
      patched.editor = owner;
      patched.created = modified;
      patched.updated = modified;
      this.case = patched;
      const { updated } = await put(patched, { jwt, host: this });
      goto(path({ ...this.case, "@id": id })); // Goto the UUID path, since there might be a serach indexing lag for finding by case number
    }

    if (true) {
      this.patches.set(path, { iri, patch: operation });
    }
  }

  isValid(sak) {
    if (!sak) {
      return false;
    }
    const { title, date } = sak;
    const number = sak["@id"];
    return title && date && Number(number) == number;
  }

  render() {
    const sak = this.case || {};

    const { title, area, protocol, comment, date, meeting } = sak || {};
    const {
      placenames,
      detected,
      valid,
      handleInvalid,
      put,
      authorized,
      editingNames,
    } = this;
    const patches = [...this.patches];

    return html`
      <form>
        <card-mdc id="case" icon="edit" outlined>
          ${sak && !sak.id
            ? html`<div slot="header">
                <h1 class="mdc-typography--headline4">
                  <button-icon icon="folder" role="presentation"></button-icon>
                  <span>${title ? title : t("case.new")}</span>
                </h1>
              </div>`
            : ""}
          <div class="edit-box">
            <mwc-textfield
              required
              not-null
              path="/title"
              op="${!title ? "add" : "replace"}"
              value=${title ? title : ""}
              placeholder="${t("any.title")}"
              label="${t("any.title")}"
              outlined
              validateOnInitialRender
              rows="1"
              minlength="3"
              maxlength="256"
              @invalid=${handleInvalid}
            >
            </mwc-textfield>
          </div>

          <mwc-textfield
            required
            ?disabled=${this.number > 0 && meeting && meeting.number > 0}
            op="${!sak || !sak["@id"] ? "add" : "replace"}"
            path="/@id"
            value="${sak && sak["@id"] ? sak["@id"] : ""}"
            type="number"
            label="${t("case.number")}"
            min="1"
            outlined
            @invalid=${handleInvalid}
          >
          </mwc-textfield>

          <mwc-textfield
            ?disabled=${this.number > 0 && meeting && meeting.number > 0}
            op="${!meeting ? "add" : "replace"}"
            path="/meeting/number"
            value=${meeting && meeting.number ? meeting.number : ""}
            type="number"
            label="${t("meeting.number")}"
            outlined
            @invalid=${handleInvalid}
          >
          </mwc-textfield>

          <mwc-textfield
            op="${!date ? "add" : "replace"}"
            path="/date"
            value=${date ? date : ""}
            required
            type="date"
            label="${t("date.date")}"
            outlined
            @invalid=${handleInvalid}
          >
          </mwc-textfield>

          <mwc-select
            @action="${({
              currentTarget: {
                selected: { value },
              },
            }) => {
              this.case = { ...this.case, area: value };
            }}"
            id="area"
            _path="/area"
            label="${t("area.area")}"
            activatable
            outlined
          >
            ${["", ...areas].map(
              (a) =>
                html`<mwc-list-item
                  graphic="icon"
                  value="${a}"
                  ?selected="${area && a === area}"
                  ?activated="${area && a === area}"
                >
                  ${a}
                </mwc-list-item>`
            )}
          </mwc-select>

          <mwc-textarea
            op="${protocol ? "replace" : "add"}"
            path="/protocol"
            value=${protocol ? protocol : ""}
            not-null
            label="${t("case.protocol")}"
            fullwidth
            outlined
            charCounter
            maxlength="10000"
            rows="${protocol ? protocol.split(/\r\n|\r|\n/).length + 10 : 10}"
            @invalid=${handleInvalid}
          ></mwc-textarea>

          <text-area
            not-null
            op="${!comment ? "add" : "replace"}"
            path="/comment"
            value=${comment ? comment : ""}
            placeholder="${t("case.comment")}"
            fullwidth
            outlined
            charCounter
            maxlength="10000"
            rows="${comment ? comment.split(/\r\n|\r|\n/).length + 2 : 2}"
            @invalid=${handleInvalid}
          ></text-area>
        </card-mdc>

        <card-mdc id="placenames"> </card-mdc>

        ${authorized && (this.validity ? this.validity.valid === true : true)
          ? html`
              <button-fab
                class="primary-fab"
                icon=${"cloud_upload"}
                label=${t("any.Edit")}
              >
              </button-fab>
            `
          : ""}
      </form>
    `;
    // Notice: No click event handler is needed on the fab button above,
    // since clicking when anything is changed will trigger a patch event,
    // that again triggers HTTP PUT
  }
}
customElements.define("case-edit", CaseEdit);
