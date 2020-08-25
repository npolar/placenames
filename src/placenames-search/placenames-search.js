// Data layer
import { v2SearchURL } from "./search-url.js";

// Security
import { isAuthorized } from "../store/user.js";

// UI
import {
  searchParams,
  add as addURLParam,
} from "@npolar/mdc/src/url/params.js";
import renderSearchResults from "./render-search-results.js";

// Parent element
import { SearchAny } from "@npolar/mdc/src/search-any/search-any.js";

const renderAfter = ({ host: { authorized }, html, t } = {}) =>
  authorized
    ? html`<div class="primary-fab">
        <a href="/nytt">
          <mwc-fab extended icon="add" label="${t("name.new")}"></mwc-fab>
        </a>
      </div>`
    : "";

export class PlacenamesSearch extends SearchAny {
  constructor() {
    super();
    //this.endpoint = _search;
    this.searchURL = v2SearchURL;
    this.renderResults = renderSearchResults;
    this.authorized = false;
    this.renderAfter = renderAfter;
  }

  async connectedCallback() {
    const params = searchParams();
    if (!params.has("q") && !params.has("sort")) {
      addURLParam(["sort", "-beginLifespanVersion"]);
    }
    super.connectedCallback();
    this.authorized = await isAuthorized({
      check: ({ rights }) => rights.includes("create"),
    });
  }
}
customElements.define("placenames-search", PlacenamesSearch);
