'use strict';

/*global L */
var attribution = '<a href="http://npolar.no">Norwegian Polar Institute</a> &mdash; <a href="https://doi.org/10.21334/npolar.2011.a2813eb6">Place names in Norwegian polar areas</a> | <a href="https://github.com/mapbox/supercluster">supercluster</a>';

var url = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var map = L.map('map').setView([76,9], 4);
map.zoomControl.remove();

L.control.zoom({
  position:'topright'
}).addTo(map);

var minZoom = 3;
var maxZoom = 13;

L.tileLayer(url, {
  maxZoom: maxZoom,
  minZoom: minZoom,
  continuousWorld: true,
  attribution: attribution
}).addTo(map);

// Alternative map projection
// Universal polar stereographic north
// To use, add these dependencies in index.html
//<script src="https://cdn.jsdelivr.net/leaflet.esri/2.0/esri-leaflet.js"></script>
//<script src="https://rawgit.com/kartena/Proj4Leaflet/master/lib/proj4-compressed.js"></script>
//<script src="https://rawgit.com/kartena/Proj4Leaflet/master/src/proj4leaflet.js"></script>
//var url = '//geodata.npolar.no/arcgis/rest/services/Basisdata_Intern/NP_Arktis_WMTS_32661/MapServer';
//var resolutions = [21674.7100160867, 10837.35500804335, 5418.677504021675, 2709.3387520108377, 1354.6693760054188, 677.3346880027094, 338.6673440013547, 169.33367200067735, 84.66683600033868, 42.33341800016934];
//var transformation = new L.Transformation(1, 28567900, -1, 32567900);
//var minZoom = 3;
//var maxZoom = 8;
//var continuousWorld = false;
//var crs = new L.Proj.CRS('EPSG:32661','+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {transformation, resolutions});
// var map = L.map('map', { crs }).setView([76,9], 4);
//L.esri.tiledMapLayer({
//  url,
//  maxZoom,
//  minZoom,
//  continuousWorld: true,
//  attribution
//}).addTo(map);

var svalbard_box = [[74, 10], [81, 34]];
var svalbard = L.rectangle(svalbard_box, { weight: 1 });
svalbard.bindTooltip("Svalbard, NO", { offset: [-150,0]});
svalbard.addTo(map);

// Jan Mayen 70°49’ og 71°10’ nordlig bredde, og mellom 7°55’ og 9°5’ vestlig lengde.
var jan_mayen_box = [[70.817,-9.083],[71.167,-7.917]];
var jan_mayen = L.rectangle(jan_mayen_box, { weight: 1});
jan_mayen.bindTooltip("Jan Mayen, NO", { offset: [20,0]});
jan_mayen.addTo(map);

var markers = L.geoJson(null, {
  pointToLayer: createIcon
}).addTo(map);

searchControlFactory().addTo(map);
clusterColorLegendFactory().addTo(map);

var worker = new Worker('worker.js');
var ready = false;

//var bordersUri = '//geodata.npolar.no/arcgis/rest/services/Temadata/Samfunn_Svalbard/MapServer/5/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson';

// Handle message from worker
worker.onmessage = function (e, m=markers) {
  if (e.data.ready) {
    ready = true;
    update();
  } else {
    m.clearLayers();
    m.addData(e.data);
  }
};

function update() {
  if (!ready) {
    return;
  }
  var bounds = map.getBounds();
  var bbox = [bounds.getWest()-10, bounds.getSouth()-10, bounds.getEast()+10, 90];
  worker.postMessage({
    bbox: bbox,
    zoom: map.getZoom()
  });
}

map.on('moveend', update);

function createIcon(feature, latlng) {
  var p = feature;
  if (!feature.properties) {
    feature.properties = {};
  }
  var coords = JSON.stringify(feature.geometry.coordinates.map(c => { return parseFloat(c.toFixed(3)); }));

  if (!feature.properties.cluster ) {

    var definition = (p.texts && p.texts.definition && p.texts.definition.en) ? p.texts.definition.en : '';
    var origin = '';

    var popup = `<div id="${p.id}"><a href="/placename/${p.id}"><b>${p.name['@value']}</b></a><br/>${ definition}<br/>${ origin }<br/>${coords}</div>`;
    var circle =  L.circle(latlng, { radius: 200 }).bindPopup(popup);
    // circle.bindTooltip(`${p.name['@value']}<br/>${coords}`);
    return circle;
  } else {

    var count = feature.properties.point_count;
    var size = count < 5 ? 'small' : count < 50 ? 'medium' : 'large';
    var icon = L.divIcon({
      html: `<div title="${coords}"><span>` + feature.properties.point_count_abbreviated + '</span></div>',
      className: 'marker-cluster marker-cluster-' + size,
      iconSize: L.point(40, 40)
    });
    var cluster_marker = L.marker(latlng, {icon: icon});
    cluster_marker.on('click', function() {
      map.setView(latlng, map.getZoom() + 2);
    });
    //cluster_marker.bindPopup(`<b>${JSON.stringify( map.getZoom() + 3 )}</b>`);
    return cluster_marker;
  }
}

function clusterColorLegendFactory(controlConfig={position: 'bottomright'}) {

	var legend = L.control(controlConfig);

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend');
		var grades = [1, 2, 5, 50];
    var sizes = ['one', 'small', 'medium', 'large'];
    var legends = ['1', '2&ndash;4', '5&ndash;49', '50+']
		var labels = [];
		var from, to, klass;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			if (i===0) {
        to = 1;
      } else {
        to = grades[i + 1];
      }
      klass = 'marker-cluster marker-cluster-'+sizes[i];
			labels.push('<i class="'+ klass +'"></i>'+legends[i]);
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};
	return legend;
}

function searchControlFactory(controlConfig={position: 'topleft'}) {

	var legend = L.control(controlConfig);

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend');
    var input = [`<h1>Placenames in Norwegian polar areas</h1>`,
      `<input name="q" class="on-map" type="search" id="supercluster-placename-search" autofocus="autofocus" value="" placeholder="Search in over 10000 official polar placenames" size="50%" autocomplete="off" style="outline: none;"/>`,
      `<p>
      <a href="http://npolar.no">Norwegian Polar Institute</a> is the naming authority of geographic names in <a href="https://data.npolar.no/placename/08100323-43fd-5a63-bf80-2d151251937a">Svalbard</a>, <a href="https://data.npolar.no/placename/7e2f0e25-8004-57d7-9818-8b705df326dc">Jan Mayen</a>, and <a href="https://data.npolar.no/placename/ca4ed267-9d11-5157-bb0d-71e9469c6660">Dronning Maud Land</a>.
      Click on the cluster circles to zoom in, or try the <a href="https://data.npolar.no/placename">text search</a>.

      </p>`];
    div.innerHTML = input.join('');
    L.DomEvent.disableClickPropagation(div); // Fix for broken search input in iOS
		return div;
	};
	return legend;
}
