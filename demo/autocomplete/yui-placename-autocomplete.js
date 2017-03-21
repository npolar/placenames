YUI().use("autocomplete", "autocomplete-filters", "autocomplete-highlighters", function (Y) {

  Y.one('body').addClass('yui3-skin-sam');

  var base = "//api.npolar.no";
  var limit = 10;

  // Npolar Placename GeoJSON API
  // Leave {query} and {callback}, they are replaced by YUI
  var source = base + "/placename/?q-name.@value={query}&filter-status=official&not-terrain.nn=utmål|bygningar&callback={callback}&format=geojson&fields=id,type,geometry,name,area,terrain,terrain_type&limit="+limit+"";

  // Formatter for HTML injected into result list items (li elements)
  var formatter = function (query, results) {
    return Y.Array.map(results, function (result) {
      var p = result.raw;
      var coords = p.geometry.coordinates;
      var latitude = (coords[1]||0).toFixed(2);
      var longitude = (coords[0]||0).toFixed(2);
      var name = p.name['@value'];
      return '<div class="">'+ name +' ('+latitude + 'N '+ longitude +'E)<br/>'+ p.area +': '+p.terrain.en +', '+ p.terrain_type + '</div>';
    });
  };

  var autocomplete = Y.one('#autocomplete-input');

  autocomplete.plug(
    Y.Plugin.AutoComplete, {
        resultHighlighter: 'phraseMatch',
        //resultFormatter  : formatter,
        resultListLocator: 'features',
        resultTextLocator: 'name.@value',
        source           : source
    }
  );

//	autocomplete.ac.on('results', function (r) {
//      console.log(r.data.features);
//  });

  autocomplete.ac.on('select', function (r) {
    var p = r.result.raw;
    window.location.href='https://data.npolar.no/placename/'+p.id;
    //Y.one("#autocomplete-output").setHTML(JSON.stringify(r.result.raw));
  });

});