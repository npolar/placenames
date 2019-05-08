'use strict';

importScripts('https://unpkg.com/supercluster@6');

const getSuperclusterIndex = () => self.idx;

const getClusters = (bbox,zoom) => getSuperclusterIndex().getClusters(bbox, zoom);

function createSuperclusterIndex(geojson, options={
    log: true,
    radius: 80,
    extent: 256,
    minZoom: 3,
    maxZoom: 10
}) {
  const supercluster = new Supercluster(options);
  self.idx = supercluster.load(geojson.features);
}

async function fetchGeoJSON() {
  const fields= "&fields=name.@value,type,geometry,id,texts,longitude,latitude";
  const uri = `https://api.npolar.no/placename/?q=&filter-status=official&format=geojson${fields}&limit=all&filter-latitude=-90..90&&filter-longitude=-180..180`;
  const timer = `Placenames API: ${uri}`;
  return fetch(uri).then(r => r.json()).then(fc => fixGeoJSON(fc));
}

function fixGeoJSON(fc) {
  const noGeo = fc.features.filter(f => !f.geometry);
  if (noGeo && noGeo.length) {
    console.warn('No geometry', JSON.stringify(noGeo.map(f => [f.id,f['name']['@value']])));
  }
  let features = fc.features.filter(f => (f.geometry && f.geometry.coordinates && f.geometry.coordinates.length));
  if (noGeo && noGeo.length) {
    features=features.concat(noGeo.map(f => {
      f.geometry = { type: "Point", coordinates: [f.longitude, f.latitude]}
      return f;
    }));
  }
  fc.features = features.map(f => {
    const coordinates = f.geometry.coordinates.map(c => +c.toPrecision(8));
    f.geometry.coordinates = coordinates;
    return f;
  });
  return fc;
}

// Receive message with bbox/zoom; send back clusters
self.onmessage = function (e) {
  if (e.data && e.data.bbox && e.data.zoom) {
    const { bbox, zoom } = e.data;
    const clusters = getClusters(bbox,zoom);
    postMessage(clusters);
  }
};

(async () => {
  const fc = await fetchGeoJSON();
  createSuperclusterIndex(fc);
  postMessage({ready: true});
})();
