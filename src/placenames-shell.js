// security
import { isValidJWT, getJWTIfValid, getJWT, setJWT, deleteJWT, refreshJWT } from "./store/user.js";
import { payload } from '@npolar/fetch-api/src/jwt.js'

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
import "@npolar/mdc/src/dialog/dialog.js";

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
      aboutToLogOut : { type: Boolean },
      sessionTime: { type: Number },
    };
  }

  // updated(p) {
  //   console.warn(p);
  // }
  
  constructor() {
    super()
    this._thresholdSessionTime = 60000 // 1min in ms
  }

  drawer() {} //disable drawer

  headerRight() {
    return whiteLogo({ host: this, t, html, height: "48" });
  }

  async getRemainingTokenValidTime() {
    const jwt = await getJWTIfValid()
    if(!jwt) return undefined
    
    this.sessionTime = new Date(payload(jwt).exp*1000 - Date.now())
    this.aboutToLogOut = this.sessionTime < this._thresholdSessionTime  
  }

  renderWarningLogOut() {
    let { aboutToLogOut, sessionTime, _warningIntervalID: intervalID } = this

    if(!aboutToLogOut) return html`` 

    if(intervalID === undefined) {
      intervalID = 
        setInterval(
          async () => {
            await this.getRemainingTokenValidTime()
          },
          1000
        )
      this._warningIntervalID = intervalID
    }

    /* 
     * Note: if one want to put the warning over a minute before the end of the
     * session, change the output (as it is it will only print the number of
     * seconds in UTC standard time).
     */
    return html`
      <dialog-mdc open>
        <button-up 
          slot="primaryAction" 
          dialogAction="refresh-session"
          @click=${() => 
            window.dispatchEvent(
              new CustomEvent('closed', 
                {
                  detail: {action: 'refresh-session', intervalID}, 
                  bubble: true
                }
              )
            )
          }>
          Refresh
        </button-up>
        <button-up 
          slot="secondaryAction" 
          dialogAction="sign-out"
          @click=${() => 
            window.dispatchEvent(
              new CustomEvent('closed', 
                {
                  detail: {action: 'sign-out', intervalID}, 
                  bubble: true
                }
              )
            )
          }>
          Log out
        </button-up>
        <div>Session is about to end. Would you like to refresh the session or log out?<div>
        <div>Session expires in ${sessionTime.getUTCSeconds()}s.</div>
      </dialog-mdc>
    `
  }

  beforeMain() {
    const { handleTabNav, activeTab, tabClicked, authorized } = this;

    return html`
    ${ this.renderWarningLogOut() }
    <nav class="app-nav-left">
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

  disconnectedCallback() {
    const { _intervalID, _warningIntervalID } = this
    super.disconnectedCallback()
    for(const id of [_intervalID, _warningIntervalID])
      if (id !== undefined) clearInterval(id)
  }

  async connectedCallback() {
    super.connectedCallback();
    this.href = "/";
    this.handleURLChange();
    this.authenticated = isValidJWT(await getJWT());

    this._intervalID = 
      setInterval(
        async () => await this.getRemainingTokenValidTime(), 
        this._thresholdSessionTime / 2
      )

    window.addEventListener("closed", 
      async ({ detail: {action, intervalID} }) => {
        clearInterval(intervalID)
        this._warningIntervalID = undefined
        switch(action) {
          case 'sign-out': 
            await this.signOut()
            break
          case 'refresh-session':
            await refreshJWT(this)
            break
        }
    })


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
