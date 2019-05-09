'use strict';

importScripts('https://unpkg.com/supercluster@6');
importScripts("https://unpkg.com/idb-keyval@3/dist/idb-keyval-iife.js");
const { warn } = console;
const { stringify, parse } = JSON;
const { del, get, keys, set} = idbKeyval;

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

async function getFeatureCollection(param={status: "official", base: "https://api.npolar.no/placename"}) {
  let fc;
  const key = stringify(param);
  const storeKeys = await keys();
  if (!storeKeys.includes(key)) {
    fc = await fetchGeoJSON(param);
    set(key, fc);
  } else {
    const cached = await get(key);
    if (!cached || !cached.updated || !cached.features || cached.features.length < 10000) {
      await del(key);
      return getFeatureCollection();
    }
    param.updated = cached.updated.replace(/z/i, ".999"); // API v1 crashes on time-filters with Z;
    const fresh = await fetchGeoJSON(param);
    if (fresh && fresh.features && fresh.features.length && fresh.features.length > 0) {
      fc=cached;
      fc.updated = fresh.updated;
      fc.features = [...cached.features, ...fresh.features];
      warn("Fresh", fresh);
      set(key, fc);
    } else {
      fc=cached;
    }
  }
  return fc;
}

async function fetchGeoJSON({status, base, updated}) {
  const fields= "&fields=name.@value,type,geometry,id,texts,longitude,latitude,updated";
  let uri = `${base}/?q=&filter-status=${status}&format=geojson${fields}&limit=all`;
  uri += `&filter-latitude=-90..90&&filter-longitude=-180..180`;
  if (updated) {
    uri += `&filter-updated=${updated}..`;
  }
  return fetch(uri).then(r => r.json()).then(fc => fixGeoJSON(fc));
}

function fixGeoJSON(fc) {
  const noGeo = fc.features.filter(f => !f.geometry);
  if (noGeo && noGeo.length) {
    warn('Features without geometry', JSON.stringify(noGeo.map(f => [f.id,f['name']['@value']])));
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
  const updated = [...new Set(fc.features.map(f => f.updated))].sort().pop();
  fc.updated = updated;
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
  const fc = await getFeatureCollection();
  createSuperclusterIndex(fc);
  postMessage({ready: true});
})();
