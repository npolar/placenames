export default class NotFound extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Finst ikkje / Not Found</h1>
		  <code>${this.location.pathname}</code>
		`;
  }
}
customElements.define("not-found", NotFound);
