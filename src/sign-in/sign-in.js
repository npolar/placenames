// security
import { authenticate } from "@npolar/fetch-api/src/v1/user/authenticate.js";
import {
  getJWTIfValid,
  setJWT,
  getRights,
  deleteJWT,
  getEmail,
  setEmail,
} from "../store/user.js";

//ui
import { get as t } from "../translate/exports.js";
import { html, LitElement } from "lit-element";
import baseStyle from "../base-element/style.js";
import { newCaseButton } from "../case-edit/new-case-button.js";

export class SignIn extends LitElement {
  static get properties() {
    return {
      jwt: { type: String },
      authenticated: { type: Boolean },
      lang: { type: String, reflected: true },
      email: { type: String },
    };
  }

  static get styles() {
    return baseStyle;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.jwt = await getJWTIfValid();
    this.addEventListener("@npolar/sign-in", this.signIn);
    if (this.jwt) {
      this.authenticated = true;
    }
    this.email = await getEmail();
  }

  async handleEvent(e) {
    e.preventDefault();
    const email = this.inputValue("[path='/email']");
    const password = this.inputValue("[type='password']");
    authenticate({ email, password, host: this });
  }

  inputValue(selector) {
    return this.renderRoot.querySelector(selector).value;
  }

  renderWelcome() {
    const { jwt, email } = this;
    return html`<div>
        <h1 class="mdc-typography--headline4">
          <button-icon
            role="presentation"
            label="offisielt"
            icon="person"
          ></button-icon>
          ${email}
        </h1>

        <a href="/sak/ny">
          <button-fab extended icon="add" label="${t("case.new")}">
          </button-fab>
        </a>
        <a href="/nytt">
          <mwc-fab extended icon="add" label="${t("name.new")}"></mwc-fab>
        </a>
      </div>
      <button-up
        extended
        mini
        icon="exit_to_app"
        label="Sign out"
        @click="${this.signOut}"
      ></button-up>`;
  }

  async signIn({ detail: { jwt, user } }) {
    this.authenticated = true;
    const { email } = user;
    this.email = email;
    this.jwt = jwt;
    setJWT(jwt);
    setEmail(email);
  }

  async signOut() {
    delete this.jwt;
    this.authenticated = false;
    deleteJWT();
  }

  render() {
    const { authenticated, jwt, email } = this;
    if (true === authenticated) {
      return this.renderWelcome();
    }
    return html`
      <h1 class="mdc-typography--headline4">
        <button-icon
          role="presentation"
          label="offisielt"
          icon="person"
        ></button-icon>
        ${t("sign-in.Sign_in")}
      </h1>

      <form @submit="${this}">
        <mwc-textfield
          outlined
          path="/email"
          type="text"
          label="${t("sign-in.email")}"
          value="${email && /@/.test(email) ? email : ""}"
          autocomplete="username"
        >
        </mwc-textfield>

        <mwc-textfield
          outlined
          path="/password"
          type="password"
          label=${t("sign-in.password")}
          placeholder="${t("sign-in.password")} [norwegian polar data centre]"
          autocomplete="current-password"
        >
        </mwc-textfield>
      </form>

      <mwc-button
        icon="security"
        @click="${this}"
        label="${t("sign-in.Sign_in")}"
      ></mwc-button>
    `;
  }
}
customElements.define("sign-in", SignIn);
