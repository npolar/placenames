import { LeafletElement } from "./leaflet-element.js";
import { attribution } from './constants.js';

const minZoom = 0;

export class WorldImageryMap extends LeafletElement {
  baseLayerConfig() {
    return [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { minZoom, attribution }
    ];
  }
}
customElements.define("world-imagery-map", WorldImageryMap);
