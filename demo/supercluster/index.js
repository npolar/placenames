'use strict';

/*global L */
let attribution = '<a href="http://npolar.no">Norwegian Polar Institute</a> &mdash; <a href="https://doi.org/10.21334/npolar.2011.a2813eb6">Place names in Norwegian polar areas</a> | <a href="https://github.com/mapbox/supercluster">supercluster</a>';

let url = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
let map = L.map('map').setView([76,9], 4);
map.zoomControl.remove();

L.control.zoom({
  position:'topright'
}).addTo(map);

let minZoom = 3;
let maxZoom = 13;

L.tileLayer(url, {
  maxZoom: maxZoom,
  minZoom: minZoom,
  continuousWorld: true,
  attribution: attribution
}).addTo(map);

let svalbard_box = [[74, 10], [81, 34]];
let svalbard = L.rectangle(svalbard_box, { weight: 1 });
svalbard.bindTooltip("Svalbard, NO", { offset: [-150,0]});
svalbard.addTo(map);

// Jan Mayen 70°49’ og 71°10’ nordlig bredde, og mellom 7°55’ og 9°5’ vestlig lengde.
let jan_mayen_box = [[70.817,-9.083],[71.167,-7.917]];
let jan_mayen = L.rectangle(jan_mayen_box, { weight: 1});
jan_mayen.bindTooltip("Jan Mayen, NO", { offset: [20,0]});
jan_mayen.addTo(map);

let markers = L.geoJson(null, {
  pointToLayer: createIcon
}).addTo(map);

searchControlFactory().addTo(map);
clusterColorLegendFactory().addTo(map);

let worker = new Worker('worker.js');
let ready = false;

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
  let bounds = map.getBounds();
  let bbox = [bounds.getWest()-10, bounds.getSouth()-10, bounds.getEast()+10, 90];
  worker.postMessage({
    bbox: bbox,
    zoom: map.getZoom()
  });
}

map.on('moveend', update);

function createIcon(feature, latlng) {
  let p = feature;
  if (!feature.properties) {
    feature.properties = {};
  }
  let coords = JSON.stringify(feature.geometry.coordinates.map(c => { return parseFloat(c.toFixed(3)); }));

  if (!feature.properties.cluster ) {

    let definition = (p.texts && p.texts.definition && p.texts.definition.en) ? p.texts.definition.en : '';
    let origin = '';

    let popup = `<div id="${p.id}"><a href="/placename/${p.id}"><b>${p.name['@value']}</b></a><br/>${ definition}<br/>${ origin }<br/>${coords}</div>`;
    let circle =  L.circle(latlng, { radius: 200 }).bindPopup(popup);
    // circle.bindTooltip(`${p.name['@value']}<br/>${coords}`);
    return circle;
  } else {

    let count = feature.properties.point_count;
    let size = count < 5 ? 'small' : count < 50 ? 'medium' : 'large';
    let icon = L.divIcon({
      html: `<div title="${coords}"><span>` + feature.properties.point_count_abbreviated + '</span></div>',
      className: 'marker-cluster marker-cluster-' + size,
      iconSize: L.point(40, 40)
    });
    let cluster_marker = L.marker(latlng, {icon: icon});
    cluster_marker.on('click', function() {
      map.setView(latlng, map.getZoom() + 2);
    });
    //cluster_marker.bindPopup(`<b>${JSON.stringify( map.getZoom() + 3 )}</b>`);
    return cluster_marker;
  }
}

function clusterColorLegendFactory(controlConfig={position: 'bottomright'}) {

	let legend = L.control(controlConfig);

	legend.onAdd = function (map) {

		let div = L.DomUtil.create('div', 'info legend');
		let grades = [1, 2, 5, 50];
    let sizes = ['one', 'small', 'medium', 'large'];
    let legends = ['1', '2&ndash;4', '5&ndash;49', '50+']
		let labels = [];
		let from, to, klass;

		for (let i = 0; i < grades.length; i++) {
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

	let legend = L.control(controlConfig);

	legend.onAdd = function (map) {

		let div = L.DomUtil.create('div', 'info legend');
    const form = `<h1>Placenames in Norwegian polar areas</h1>
      <form action="">
      <input class="on-map" type="search" id="supercluster-placename-search" autofocus="autofocus" value="" placeholder="Search in over 10000 official polar placenames" size="40%" autocomplete="off" style="outline: none;"/>
      <select id="area-select">
          <option value="">all areas</option>
          <option>Svalbard</option>
          <option>Jan Mayen</option>
          <option>Dronning Maud Land</option>
          <option>Bouvetøya</option>
          <option>Peter I Øy</option>
      </select>
      <button hidden name="search" class="on-map" formtarget="_blank"><a>text search</a></button>
      <p>Press coloured circles to zoom in and reveal named places (open blue circles)</p>
      </form>`;
    div.innerHTML = form;
    L.DomEvent.disableClickPropagation(div); // Fix for broken search input in iOS
		return div;
	};
	return legend;
}
