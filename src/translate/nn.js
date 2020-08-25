import npolar from "@npolar/mdc/src/dict/npolar/nb.js";
import placename from "../placename/translate/nn.js";
import { nn as country } from "../vocab/country.js";
import { nn as status } from "../vocab/status.js";
const name = "Stadnamn i norske polarområde";
const heading = "Polare stadnamn";

const site = {
  name,
  heading,
  slogun: "offisielt stadnamnregister for polarområda",
  org: npolar.name,
};

const app = { ...site };

const sak = {
  case: "sak",
  cases: "saker",
  sak: "sak",
  number: "saksnummer",
  Case: "Sak",
  Cases: "Saker",
  new: "ny sak",
  Committee: "Stadnamnkomitéen",
  search: { placeholder: "Søk i protokollane til stadnamnkomitéen" },
  remove_placename_from_case: "fjern stadnamn frå saken",
};

const ref = {
  References: "Referansar",
};

export default {
  any: {
    min: "minst",
    characters: "teikn",
    new: "ny",
    add: "legg til",
    remove: "fjern",
    edit: "skriv",
    link: "koble",
    link_to: "koble til",
    to: "til",
    back: "tilbake",
    title: "tittel",
    linked_to: "kobla til",
  },
  case: sak,
  date: {
    date: "dato",
  },
  country,
  area: "område",
  drawer: {
    folder: "Saker",
    close: "skjul meny",
    place: "Stadnamn",
    add_box: "publiser data",
    offline_bolt: "bruk uten nett",
    apps: "andre applikasjoner",
    link: "maskinlesbare data",
  },
  org: {
    npolar: npolar.name,
  },
  "cases-search": {
    heading: "Polare stadnamn",
    welcome: " ",
    documents: "namn",
    input: {
      placeholder: "Søk i saksarkivet til stadnamnkomitéen",
    },
  },
  meeting: {
    number: "møtenummer",
  },
  "placenames-shell": { name, heading, site },
  "placenames-search": {
    heading: "Polare stadnamn",
    welcome: " ",
    documents: "namn",
    _welcome: "Stadnamn i norske polarområde",
    input: {
      placeholder: "Søk: stadnamn, person, historikk, år",
    },
  },
  "edit-status": {
    editing: "skriv",
    invalid: "ugyldig",
    saving: "lagrer",
    saved: "lagra",
    failed: "feila",
  },
  name: placename,
  opensearch: { totalResults: "treff" },
  lang: {
    undefined: "udefinert språk",
    lang: "språk",
    "@language": "språk",
    language: "språk",
    no: "norsk",
    nb: "bokmål",
    nn: "nynorsk",
    en: "engelsk",
    nl: "nederlandsk",
    ru: "russisk",
    sv: "svensk",
    it: "italiensk",
    fr: "fransk",
    is: "islandsk",
    switch: {
      no: "norsk",
      en: "English",
    },
    native: {
      nn: "nynorsk",
      en: "English",
    },
  },
  ref,
  area: {
    area: "område",
  },
  remove: "fjern",
  "sign-in": {
    Sign_in: "Logg inn",
    password: "passord",
    email: "e-post",
  },
  status,
  terrain: {
    terrain: "terreng",
    terrain_type: "INSPIRE-type",
  },
  validity: {
    valueMissing: "må vere med",
  },
};
