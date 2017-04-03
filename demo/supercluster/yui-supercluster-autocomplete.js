YUI().use("autocomplete", "autocomplete-filters", "autocomplete-highlighters", function (Y) {

  Y.one('body').addClass('yui3-skin-sam');

  // Npolar Placename GeoJSON API
  // Leave {query} and {callback}, they are replaced by YUI
  var uri = '//api.npolar.no/placename/?q-name.@value={query}&callback={callback}&filter-status=official&not-terrain.nn=utmål|bygningar&format=geojson&fields=id,type,geometry,name,country,area,terrain,terrain_type,texts&limit=20';
  var autocomplete = Y.one('#supercluster-placename-search');
  autocomplete.plug(
    Y.Plugin.AutoComplete, {
      resultHighlighter: 'phraseMatch',
      resultListLocator: 'features',
      resultTextLocator: 'name.@value',
      source           : uri
    }
  );

  autocomplete.ac.on('select', function (r) {
    var p = r.result.raw;
    var latlng = L.GeoJSON.coordsToLatLng(p.geometry.coordinates);
    var circle = L.circle(latlng, { radius: 1000, color: 'red' });

    circle.bindPopup(namePopupHTML(p)).addTo(map).openPopup();
    map.setView(latlng, 9);

  });

  function namePopupHTML(p) {
    var definition = (p.texts && p.texts.definition && p.texts.definition.en) ? p.texts.definition.en : '';
    definition = definition.substring(0,500);
    var origin = (p.texts && p.texts.origin && p.texts.origin.en) ? p.texts.origin.en : '';
    origin = origin.substring(0,500);
    var coords = JSON.stringify(p.geometry.coordinates.map(c => { return parseFloat(c.toFixed(3)); })).split(',').join(', ');

    var h = ['<b><a href="/placename/'+p.id+'">'+p.name['@value']+'</a></b>', p.area+', '+p.country, coords, '', definition, '', origin];
    return h.join('<br/>');
  }

});
