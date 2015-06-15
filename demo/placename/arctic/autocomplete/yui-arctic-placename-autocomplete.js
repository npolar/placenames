YUI().use("autocomplete", "autocomplete-filters", "autocomplete-highlighters", function (Y) {
  
  Y.one('body').addClass('yui3-skin-sam');

  var base = "//api.npolar.no";
  var limit = 25;

  // Arctic Placename GeoJSON API
  // Leave {query} and {callback}, they are replaced by YUI
  var source = base + "/placename/arctic/?q={query}&callback={callback}&format=geojson&variant&limit="+limit+"";
  
  // https://raw.githubusercontent.com/worlddb/world.db.flags/master/vendor/assets/images/flags/32x32/is.png
  var flag = function(properties) {
    if (/naalakkersuisut\.gl/.test(properties.sourceOfName)) {
      return '<img alt="Grønland" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAG2YAABzjgAA9QIAAIdZAABxXAAA5wgAADHfAAAYl13LwmsAAAMjSURBVHja7JdNaFxVFIC/+959mXmvk7SGNgEXbrqIVLspRURXgm66E9RVN7oQcdOuum8XLsWVgiuRYgtFEUqLpRsRVEpp0QRNrXGSUVNsYjJN5u+9effe08U8M+10mmQyJW/jgcPjch/nfPfcc+49V4kIeYrKG8AjZ8kdQAE+UMi+uykWSBTwlIis5rJ6pcY9YG+OO7DXy8KflxT0dv+U1GDurmDXa+B56PF96InxoQm2BHCtmNrVH2lcn8Eur+JSA4BfLKKfmWTslReJXjg8VBVMicitfpNmeZWljz4nnivj+SMorUGpTkScQJoi4hh77WXG334d5fuDJuGzj42Aq7f454NPiX8v4xcjxBqkbfrsjVD9+hvEOfa/+9aT24LVLy7SuDmNDku4enOL8xyq5y4RHjnEnqPPDw9gVtZY++oqtAUrLRDZCP1/q0apzrcTS1yzRfXsxScDgAjJQgU1EqI8r2fKZT69bCwopZDU0rg2jfn3Hnr/vuEA0oVF8AO8YqFv1vYbq0AjaUq6sDg4wOzUMWyjhWQlduDEcQ79cmlHZVV+8ySN725snjOBxh8rdQGsMUgcI8Zikwbt+b935FxSQzJbxq3XUYVgk2vI4KJiF0CMAa1BwNMhjR9+xtab+KVoIIDGtWnalUVUWHg4aR+Ju8alabcfcMZ2Mto5lPaJb89TPX954AisfHIOidsbth6rIg8DWGNBACfgBC/Q3D3zMclcZdvOq+cvU/3yCl5U7NgR2bD3iAq41D0IYEB1SkpEINC07yxRfuMk8W/zWzu/cIU/3zsNykcks+Nkw16vosBY0wUQa7sHTEbuRSHxzG3mXn2HpQ8/o12505NIjtZPs/z1/hkqx08hcYIK/K6NzRRwmU8FTH0/euTWaBjhmq2+me2SmGBygvC5gwRPTyDGkMwvEv/6B7ZWx48i8NT2G9EopB43eWn9Zucykt6jtrdmgxJ2rUbt2+vgbIdb+3gjAX5pz056MZyTB8ow2xdvwLIbRpx0AaxDuFer7WovJgiAVcAkcBg4sMv94DIwo7KmdDSH5jQBaur/x2neb8P7AwCW/LhxCX+/GQAAAABJRU5ErkJggg==" />';
    } else if (/(Norwegian|npolar.no)/.test(properties.sourceOfName)) {
      return '<img alt="Norge" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJtSURBVHja7Jc/axRBFMB/s9kzHiY5ECRKEIMICmJhZyNCQLAUxCJfwK/gZ7AVbPwCabTXSqwsLSxiaSrzBzySvdu93Zl5z2LX3b3ksnvk5NLkNTMM78385r2ZN2+MqnKeEnDOcgFggAVgsWjnKR5IQ2Dl9/OXfwia17/+cYtnr7YA+PR+k90XmzP63nDjw9bVEOhhArpPHrfabDxaL/vT6DdJtr0N0AuBRfWCpilyeAT/rqUxeVu7prsHw3LY7+3nOpOu8XHbY3pBrwepBVgM89kcmozQ0aiROs1c2dc0PfPudTRCnQWgAPBIkiBJ0miYjCqANt1G6XSQrAagzqFxjLZMOkxstYsZADQMwbk6gEejCB0OWwCyapIW3UYAQLOsFgJr8YMBGseNhlFcAcgsAKpQnKHyEEo0OHkItUhVxQEexrYGEJfjmGP6k+xr48YL2JoH1r59nYp8EGclzdqXz/8hD5sc4PbTdxAo1spUdjc33s60bqcTEAZB5QHrPIM4wzphHtIJA3rLl8vo3RWRn8aYVsPuwzd5Pvj+emYIVSUIgnshwM6d+5g0Ra071WB9bweRKp3+Wr119tB3QrTbrULgnSNUBWkOgdTzvsgs20dsLROKdSiKtkyqNQ+oyNgVnXgd9XQAb2uZULyDhXDyyzbmgfFJTiygp/Qn1EHejwFIXg+1AIxV0DNW0+Klqgm9SPWGz6UQNIjUAEQVM0cAUwPIX0PNPRAsLTUaLl+5VFU1LbqtIdAKwAvQj44aDVb6faKjQwD6/X6r/jRPMuANsAo8AK7NuSw/AH6Y4k+wXLTzlBSIzMXn9LwB/g4AW7s7XlkEogEAAAAASUVORK5CYII=" />';
    } else if (/IS.GN.LMI/.test(properties.namespace)) {
      return '<img alt="Island" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFEUExURf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEnfQEnfgEnfwEqhwIofwIriAMqgQQrgQQsiAUrhAUuiQYsgwcvigguhgkvhgsyiwsyjAszjAwyiQwzjA00jQ4zig41jRE2jRE3jRQ5jhY7kCpNmy9RnTNUnjRVnzRVoDVVnzhYoTpaojxboz1coz9epEFfpUJgpkNipkRip0dlqEhmqUlmqUlnqUpnqUtoqk1qq1NurVdyr1dysF54s2F6tWF7tWV+t2uCuXCHvHKIvHKJvHqPwIKWxIqdyM0VG9wXHdwYHtwZH90bId0dI90fJN0fJd0hJt0mK94jKeAxNuAzOOA1OuE2O+E5PuE6QOE7QeNFS+VQVeZYXOZaX+hmaelvc+t3e+t+gex/gu6Ulu7u7v7+/v///4fRI6QAAAAOdFJOUwADBwoNERQXGyAkJ0RZqfglgAAAAPlJREFUGBnFwbFNA0EURdH7Zz+yTMgm1OEGkOiASqmABgjogAKQhcgW2bvzHhZjB2NpQ8Q58P8iSrDOytwVmt3E7Ru98poZI2cbGOlNmUWWCQwKljAngQnDoJLIlcZGdIpJapWBMAZhTgJMmDCJVGkMlY4WEi0LjWGhN5PU+ZtGMNHZziSejoDDGA4mcIDDARbJIxc2D1x5T76icvFJbwgSyazRQHIXnH34nismeTke+PUkeKaz2ZBIojGIjkQySzQG0VElmYdKY6h04kCyDKIxiF6lUAdWDQsFBauikqiMNFsY6VXS2tNoQnt6dmxugnWeo2RhnRb+3g8yBH/U9KLQ4QAAAABJRU5ErkJggg==" />';
    }
    return "";  
  };
  
  var names = function(properties) {
    return Y.Array.filter(properties.names, function(n) {
        return (n.nameStatus != "historical");
    });
  };
  
  var name = function(properties) {
    if (properties.name) {
      return properties.name;
    } else {
      return Y.Array.map(names(properties), function(n) {
        return n.name;
      });
    }
  };
  
  // Formatter for HTML injected into result list items (li elements)
  var formatter = function (query, results) {
    return Y.Array.map(results, function (result) {
      var feature = result.raw;
      var p = feature.properties;
      //console.log(p);
      
      var latitude = (p.latitude||0).toFixed(2);
      var longitude = (p.longitude||0).toFixed(2);

      return '<div class="">'+ flag(p) + name(p).join(' / ') +' ('+latitude + 'N '+ longitude +'E)<br/>'+''+ p.type + '</div>';
    });
  };

  var autocomplete = Y.one('#autocomplete-input');

  autocomplete.plug(
    Y.Plugin.AutoComplete, {
        resultHighlighter: 'phraseMatch',
        resultFormatter  : formatter,
        resultListLocator: 'features',
        resultTextLocator: 'properties.names.name',
        source           : source
    }
  );

	//autocomplete.ac.on('results', function (r) {
      //console.log(r.data.features);
  //});
			
  autocomplete.ac.on('select', function (r) {
    Y.one("#autocomplete-output").setHTML(JSON.stringify(r.result.raw));
  });

});