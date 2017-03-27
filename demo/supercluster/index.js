'use strict';

/*global L */

let url = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// Alternative map:
// Arctic polar stereographic (uncomment dependencies in index.html)
//let url = '//geodata.npolar.no/arcgis/rest/services/Basisdata_Intern/NP_Arktis_WMTS_32661/MapServer';
//let resolutions = [21674.7100160867, 10837.35500804335, 5418.677504021675, 2709.3387520108377, 1354.6693760054188, 677.3346880027094, 338.6673440013547, 169.33367200067735, 84.66683600033868, 42.33341800016934];
//let transformation = new L.Transformation(1, 28567900, -1, 32567900);
//let minZoom = 3;
//let maxZoom = 17;
//let continuousWorld = false;
//let crs = new L.Proj.CRS('EPSG:32661','+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {transformation, resolutions});

// let map = L.map('map', { crs }).setView([76,9], 4);
//L.esri.tiledMapLayer({
//  url,
//  maxZoom,
//  minZoom,
//  continuousWorld: true,
//  attribution: '<a href="http://npolar.no">Norwegian Polar Institute</a> &mdash; <a href="https://doi.org/10.21334/npolar.2011.a2813eb6">Place names in Norwegian polar areas</a>'
//}).addTo(map);

var map = L.map('map'/*, { crs: crs }*/).setView([76,9], 4);
let minZoom = 3;
let maxZoom = 17;

L.tileLayer({
  url,
  maxZoom,
  minZoom,
  continuousWorld: true,
  attribution: '<a href="http://npolar.no">Norwegian Polar Institute</a> &mdash; <a href="https://doi.org/10.21334/npolar.2011.a2813eb6">Place names in Norwegian polar areas</a>'
}).addTo(map);

var svalbard_box = [[74, 10], [81, 34]];
L.rectangle(svalbard_box, { /*color: "#ff7800", weight: 1*/}).addTo(map);

// Jan Mayen 70°49’ og 71°10’ nordlig bredde, og mellom 7°55’ og 9°5’ vestlig lengde.
var jan_mayen_box = [[70,-10],[72,-7]];
L.rectangle(jan_mayen_box, { /*color: "#ff7800", weight: 1*/}).addTo(map);

var markers = L.geoJson(null, {
    pointToLayer: createClusterIcon
}).addTo(map);

var worker = new Worker('worker.js');
var ready = false;

worker.onmessage = function (e) {
    if (e.data.ready) {
        ready = true;
        update();
    } else {
        markers.clearLayers();
        markers.addData(e.data);
    }
};

function update() {
    if (!ready) return;
    var bounds = map.getBounds();
    var bbox = [bounds.getWest()-10, bounds.getSouth()-10, bounds.getEast()+10, 90];
    worker.postMessage({
      bbox,
      zoom: map.getZoom()
    });
}

map.on('moveend', update);

function createClusterIcon(feature, latlng) {
    if (!feature.properties.cluster) {
      let p = feature;
      let definition = (p.texts && p.texts.definition && p.texts.definition.en) ? p.texts.definition.en : '';
      let origin = '';
      let coords = JSON.stringify(p.geometry.coordinates);
      let popup = `<a href="https://data.npolar.no/placename/${p.id}"><b>${p.name['@value']}</b></a><br/>${ definition}<br/>${ origin }<br/>${coords}`;

      return L.circle(latlng, { radius: 1000 }).bindPopup(popup);
    }
    //console.log(feature);
    var count = feature.properties.point_count;
    var size =
        count < 50 ? 'small' :
        count < 500 ? 'medium' : 'large';
    var icon = L.divIcon({
        html: '<div><span>' + feature.properties.point_count_abbreviated + '</span></div>',
        className: 'marker-cluster marker-cluster-' + size,
        iconSize: L.point(40, 40)
    });
    let m = L.marker(latlng, {icon: icon});
    m.bindPopup(`<b>${JSON.stringify(feature.geometry.coordinates)}</b>`);
    return m;
}
