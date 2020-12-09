// Data layer
import { _search } from "../api/v2/placename/case/search.js";
import { path } from "../case/path.js";
import { base as caseBase } from "../case/base.js";

// Security
import { isAuthorized } from "../store/user.js";

// UI
import { searchParams, add as addParam } from "@npolar/mdc/src/url/params.js";
import { changeLang, get as tg, get as t } from "../translate/exports.js";
import { html } from "lit-element";
import { newCaseButton } from "../case-edit/new-case-button.js";
// Internals
import { emit } from "@npolar/mdc/src/host/event.js";
import { SearchAny } from "@npolar/mdc/src/search-any/search-any.js";
import { casesSearchURL } from "./cases-search-url.js";

const byline = (sak, { t }) =>
  `${t("case.Case")} ${sak["@id"]} (${new Date(sak.date).getFullYear()})`;

const renderCaseSearchResults = ({ entries = [], html, t }) =>
  entries.map(
    ({ title, date, ...sak }) => html`
      <card-mdc
        headline="${title || date || sak["@id"]}"
        byline="${byline({ ...sak, date }, { t })}"
        href=${path(sak)}
        icon=${"folder"}
      >
      </card-mdc>
    `
  );

export class CasesSearch extends SearchAny {
  static get properties() {
    return {
      filters: { type: Array }
    }
  }

  constructor() {
    super();
    this.endpoint = _search;
    this.searchURL = casesSearchURL;
    this.renderResults = renderCaseSearchResults;
    this.authorize = false;
    this.renderAfter = newCaseButton;
  }

  async connectedCallback() {
    const params = searchParams();
    if (!params.has("q") && !params.has("sort")) {
      addParam(["sort", "-@id"]);
    }

    super.connectedCallback();

    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("create"),
    });

    const host = this;
    emit({
      host,
      name: "@npolar/title",
      detail: { title: t("case.Cases") },
    });
  }
}
customElements.define("cases-search", CasesSearch);
