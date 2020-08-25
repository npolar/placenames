import { LeafletElement } from "./leaflet-element.js";

const attribution =
  "Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community";

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
