  YUI().use("autocomplete", "autocomplete-filters", "autocomplete-highlighters", function (Y) {

  Y.one('body').addClass('yui3-skin-sam');

  const { warn} = console;

  // Npolar Placename GeoJSON API
  // Leave {query} and {callback}, they are replaced by YUI
  const inputSelector = '#supercluster-placename-search';
  const autocomplete = Y.one(inputSelector);

  const areaSelect = document.querySelector("#area-select");
  const input = document.querySelector("input");
  const form = document.querySelector("form");
  const button = document.querySelector("button");
  const a = document.querySelector("button > a");


  let uri = `https://api.npolar.no/placename/?q-name.@value={query}&callback={callback}&filter-status=official&format=geojson&fields=id,type,geometry,name,country,area,terrain,terrain_type,texts&limit=20`;
  let area;

  areaSelect.addEventListener("change", e=> {
    area = areaSelect.selectedOptions[0].value;
    const url = new URL(uri);
    const {searchParams} = url;
    const areaFilter = `&filter-area=${encodeURI(area)}`;
    if (area && area.length > 0) {
      uri += areaFilter;
    } else {
      uri=uri.split("&filter-area=")[0]
    }
    warn(uri);
    // Since providing a functon to source does not work, modify the uri variable
    autocomplete.ac.set('source', uri);
  });


  input.addEventListener("input", e=> {
    const q = input.value;
    input.setAttribute("value",q);
    button.hidden = (q.length === 0) ? true : false ;
    let href = `https://data.npolar.no/placename/?filter-status=official&q=${encodeURI(q)}`;
    if (area && area.length) {
      href += `&filter-area=${area}`;
    }
    a.setAttribute("href", href);
  });

  function resultFormatter(query, results) {
    return Y.Array.map(results, function (result) {
      let p = result.raw;
      const name = p.name['@value'];
      let { coordinates } = p.geometry;
      const [longitude,latitude] = coordinates.map(c => parseInt(c));

      return `<div class=""><b>${name}</b> ${p.area} [${longitude},${latitude}] ${p.terrain.en}/${p.terrain_type}</div>`;
    });
  };

  autocomplete.plug(
    Y.Plugin.AutoComplete, {
      resultFormatter,
      resultHighlighter: 'phraseMatch',
      resultListLocator: 'features',
      resultTextLocator: 'name.@value',
      source: uri
    }
  );

  autocomplete.ac.on('select', function (r) {

    let p = r.result.raw;
    let href = `https://data.npolar.no/placename/?filter-status=official&q=${ encodeURI(p.name['@value'])}`;
    a.setAttribute("href",href);

    let latlng = L.GeoJSON.coordsToLatLng(p.geometry.coordinates);
    let circle = L.circle(latlng, { radius: 600, color: 'red' });
    input.setAttribute("value",p.name['@value']);
    circle.bindPopup(namePopupHTML(p)).addTo(map).openPopup();
    map.setView(latlng, 9);
  });

  function namePopupHTML(p) {
    let definition = (p.texts && p.texts.definition && p.texts.definition.en) ? p.texts.definition.en : '';
    definition = definition.substring(0,500);
    let origin = (p.texts && p.texts.origin && p.texts.origin.en) ? p.texts.origin.en : '';
    origin = origin.substring(0,500);
    let coords = JSON.stringify(p.geometry.coordinates.map(c => { return parseFloat(c.toFixed(3)); })).split(',').join(', ');

    let h = ['<b><a href="/placename/'+p.id+'">'+p.name['@value']+'</a></b>', p.area+', '+p.country, coords, '', definition, '', origin];
    return h.join('<br/>');
  }

});
