import { get } from "../ref/get.js";
import { get as t } from "../translate/exports.js";
import { renderRef } from "./render-ref.js";
import style from "../base-element/style.js";
import { html, LitElement } from "lit-element";

export class RefArticle extends LitElement {
  static get properties() {
    return {
      ident: { type: Number, reflected: true },
      ref: { type: Object },
      names: { type: Array },
      complete: { type: Boolean },
    };
  }

  static get styles() {
    return style;
  }

  async connectedCallback() {
    super.connectedCallback();
    const { params } = this.location; // this.location.params are injected by vaadin-router
    const ident = Number(params.ident);
    if (ident > 0) {
      this.ident = ident;
      this.ref = await get(ident);
      //this.findNames();
    }
    await this.ref;
  }

  render() {
    const { ref, names, maps } = this;
    return renderRef(ref, { html, t, names, maps });
  }
}
customElements.define("ref-article", RefArticle);
