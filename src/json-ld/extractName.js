function _name(d, language='en') {
  if (!d) {
    return '';
  }

  if (String(d) === d) {
    return d;
  }

  if (d.name) {
    if (String(d.name) === d.name) {
      return d.name;
    }
    if (language in d.name) {
      return d.name[language];
    }
    if (d.name['@value']) {
      return d.name['@value'];
    }
    if (d.name instanceof Array) {
      const cand = d.name.find(n => n['@language'] === language);
      if (cand) {
        return cand['@value'];
      } else if ('@value' in d.name[0]) {
        return d.name[0]['@value'];
      }
    }
    return JSON.stringify(d.name);
  }

  if (d.title) {
    if (String(d.title) === d.title) {
      return d.title;
    } else {
      return _name({name: d.title });
    }
  }

  if (d.code) {
    return _name({title: d.code});
  }
  if (d.last_name && d.first_name) {
    return _name({ name: `${d.first_name} ${d.last_name}`});
  }
  if (d.id||d._id) {
    return d.id||d._id;
  }

}

export {_name as extractName};
