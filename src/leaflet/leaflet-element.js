import {
  Map as LeafletMapClass,
  TileLayer,
} from "leaflet/dist/leaflet-src.esm.js";

const eventFactory = (name, detail) =>
  new CustomEvent(name, { detail, bubbles: true, composed: true });

export class LeafletElement extends HTMLElement {
  connectedCallback() {
    this.host = this.createHost();
    this.initMap(this.host);
    const action = "connected";
    const { map, host } = this;
    this.dispatchEvent(eventFactory("leaflet-map", { action, map, host }));
  }

  initMap(elmt) {
    let layers;
    const baseConfig = this.baseLayerConfig();
    if (baseConfig && baseConfig.length === 2) {
      const [url, options] = this.baseLayerConfig();
      layers = [new TileLayer(url, options)];
    }
    const config = {
      center: this.center,
      zoom: +this.getAttribute("zoom"),
      layers,
    };
    this.map = new LeafletMapClass(elmt, config);
    return this.map;
  }

  get center() {
    if (this.hasAttribute("center")) {
      return this.getAttribute("center")
        .split(",")
        .map((n) => +n);
    } else {
      return [0, 0];
    }
  }

  set baseLayer(url) {
    this._baseLayerUrl = url;
  }

  get baseLayer() {
    return this._baseLayerUrl;
  }

  get map() {
    return this._map;
  }

  set map(map) {
    this._map = map;
  }

  baseLayerConfig() {}

  createHost() {
    const div = document.createElement("div");
    const link = document.createElement("link");
    link.href = "/leaflet/leaflet.css";
    link.rel = "stylesheet";
    div.style = `width: 100%;
      height: 400px;
      z-index: 0;
    `;
    this.appendChild(link);
    this.appendChild(div);
    return div;
  }
}
customElements.define("leaflet-element", LeafletElement);
