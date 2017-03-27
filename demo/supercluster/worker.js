'use strict';

importScripts('supercluster.min.js');

var now = Date.now();

var index;

// curl "http://api.npolar.no/placename/?q=&filter-status=official&format=geojson&fields=name.@value,area,type,geometry,terrain,id,texts&sort=-area&limit=all" > np.json
getJSON('np-placenames.json', function (geojson) {
    console.log('loaded ' + geojson.features.length + ' points JSON in ' + ((Date.now() - now) / 1000) + 's');

    index = supercluster({
        log: true,
        radius: 40,
        extent: 256,
        maxZoom: 17
    }).load(geojson.features);

    //console.log(index.getTile(0, 0, 0));
    postMessage({ready: true});
});

self.onmessage = function (e) {
    if (e.data) {
        postMessage(index.getClusters(e.data.bbox, e.data.zoom));
    }
};

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            callback(xhr.response);
        }
    };
    xhr.send();
}
