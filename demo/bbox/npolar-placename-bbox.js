'use strict';

function NpolarPlacenameBbox() {

  var self = this;
  this.limit = 'all';
  this.status = 'official';
  this.fields = 'id,type,geometry,name.@value,texts.definition,texts.origin';
  this.base='//api.npolar.no/placename/?q=&format=geojson&filter-status='+ self.status +'&fields='+ self.fields;
  this.jsonp = false; //'myCallback';

  this.onload = function(e) {
    if (e && e.target && e.target.responseText) {

      var fc = JSON.parse(e.target.responseText);
      if (self.processor) {
        self.processor(fc);
      }

    } else {
      console.warn('Npolar placenames bbox request failed', e);
    }
  };

  this.sendHTTPRequest = function (uri) {
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    var request = new XMLHttpRequest();
    request.addEventListener('load', self.onload);
    request.open('GET', uri);
    request.setRequestHeader('Accept', 'application/geo+json');
    request.send();
  };

  this.uri = function(bbox) {
    var p = bbox.split(',');
    var w = p[0];
    var s = p[1];
    var e = p[2];
    var n = p[3];
    var uri = self.base+'&filter-longitude='+ w +'..'+ e +'&filter-latitude='+ s +'..'+n +'&limit='+ self.limit;
    if (self.jsonp !== false) {
      uri += '&callback='+self.jsonp;
    }
    console.debug('bbox uri', uri);
    return uri;
  }

  this.find = function(bbox, FeatureCollectionProcessor=function(){}) {
    self.processor = FeatureCollectionProcessor;
    var uri = self.uri(bbox);

    if (self.jsonp !== false) {
      console.debug('JSONP', self.jsonp);
      var script = document.createElement('script');
      script.src = uri;
      document.head.appendChild(script);

    } else {
      self.sendHTTPRequest(uri);
    }


  };
}
