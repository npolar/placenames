// security
import { isValidJWT, getJWT, setJWT, deleteJWT } from "./store/user.js";

// routing
import { routes } from "./routes.js";
import { base as placenameBase } from "./placename/base.js";
import { base as caseBase } from "./case/base.js";

// translation
import {
  get as translator,
  get as t,
  register,
  prefer,
  isNorwegian,
  loader,
  changeLang,
} from "./translate/exports.js";

import { getUserLang } from "./store/user.js";

// UI
import { whiteLogo } from "@npolar/mdc/src/app-shell/npolar-logo.js";
import "@npolar/mdc/src/tab-bar/tab-bar.js";

// Internals
import { AppShellMixin, Router } from "@npolar/mdc/src/app-shell/exports.js";
import { LitElement, html } from "lit-element";

// Utils
let lang = getUserLang();
const tabIndexFromPath = (path) => {
  return path.startsWith(caseBase) ? 1 : 0;
};

const showEditorMenu = ({ pathname }) => {
  console.warn({ pathname });
  return [placenameBase, caseBase].includes(pathname);
};

// const menu = ({ t }) =>
//   [
//     ["place", "/"],
//     ["folder", caseBase],
//     //["person", "/sign-in"],
//     //["link", "/api/v1"],
//     //["apps", "/apps"],
//     //["add_box", "/new"],
//     //["offline_bolt", "/offline"]
//   ].map(([icon, href]) => [t(`drawer.${icon}`), { icon, href }]);

export class PlacenamesShell extends AppShellMixin({
  superclass: LitElement,
  html,
  lang,
  translator,
  changeLang,
  routes,
  //menu,
}) {
  static get properties() {
    return {
      ...super.properties,
      activeTab: { type: Number },
    };
  }

  // updated(p) {
  //   console.warn(p);
  // }

  drawer() {} //disable drawer

  headerRight() {
    return whiteLogo({ host: this, t, html, height: "48" });
  }

  beforeMain() {
    const { handleTabNav, activeTab, tabClicked, authorized } = this;

    return html`<nav class="app-nav-left">
      <mwc-tab-bar activeIndex="${activeTab}">
        <mwc-tab
          href="${placenameBase}"
          label="${t("name.Placenames")}"
          @click="${tabClicked}"
          isMinWidthIndicator
        ></mwc-tab>
        <mwc-tab
          href="${caseBase}"
          label="${t("case.Cases")}"
          @click="${tabClicked}"
          isMinWidthIndicator
        ></mwc-tab>
      </mwc-tab-bar>
    </nav>`;
  }

  afterMain() {
    const { pathname } = new URL(document.URL);
    const { jwt, authenticated } = this;

    return html`
      <button-up
        icon="language"
        label="${t(`lang.native.${this.lang === "en" ? "nn" : "en"}`)}"
        @click=${() => changeLang(this.lang === "en" ? "nn" : "en")}
      >
      </button-up>
      ${authenticated
        ? html` <button-up
            extended
            mini
            icon="exit_to_app"
            label="Sign out"
            @click="${this.signOut}"
          ></button-up>`
        : html`<a href="/sign-in">
            <button-up extended mini icon="person" label="Sign in"></button-up>
          </a>`}
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.href = "/";
    this.handleURLChange();
    this.authenticated = isValidJWT(await getJWT());

    window.addEventListener("popstate", () => this.handleURLChange());

    window.addEventListener(
      "@npolar/sign-in",
      ({
        detail: {
          jwt,
          user: { email },
        },
      }) => {
        setJWT(jwt);
        this.authenticated = true;
        localStorage.setItem("email", email);
      }
    );
    window.addEventListener("@npolar/sign-out", ({ detail: { jwt, user } }) => {
      this.signOut();
    });
    window.addEventListener("@npolar/lang", ({ detail: { lang } }) => {
      localStorage.setItem("lang", lang);
    });
  }

  async signOut() {
    await deleteJWT();
    this.authenticated = false;
    Router.go("/");
  }
  // async authorize({ user, jwt }) {
  //   const system = "https://api.npolar.no/placename";
  //   this.user = user;
  //   this.jwt = jwt;
  //   console.warn(this);
  //   //const auth = await authorize({ jwt, system });
  // }

  showNavIcon() {
    return false; // +this.activeTab > 0;
  }

  handleURLChange(url = document.location) {
    let { pathname, hash, search } = url;
    const hashbang = "#!";
    if (hash && hash.startsWith(hashbang + "/")) {
      const hashbangpath = hash.split("#!")[1].split("?")[0];
      if (pathname === hashbangpath) {
        url.hash = undefined;
      } else {
        pathname = hashbangpath;
        console.warn(pathname, "<-", hash);
        history.replaceState(null, "", pathname);
      }
    }
    this.activeTab = tabIndexFromPath(pathname);
  }

  // React to nav tab clicked
  tabClicked({ currentTarget }) {
    const { pathname, searchParams, search } = new URL(document.location); // current path(name)
    const href = currentTarget.getAttribute("href"); // destination href
    this.activeTab = tabIndexFromPath(href);
    if (href !== pathname) {
      searchParams.delete("status"); // No status for cases
      searchParams.delete("sort"); // Reset sorting
      Router.go({ pathname: href, search: "?" + String(searchParams) });
    }
  }
}
customElements.define("placenames-shell", PlacenamesShell);
