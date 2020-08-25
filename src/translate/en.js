import npolar from "@npolar/mdc/src/dict/npolar/en.js";
import placename from "../placename/translate/en.js";
import { en as country } from "../vocab/country.js";

const name = "Place names in Norwegian polar areas";
const heading = "Polar place names";
const site = {
  name,
  heading,
  slogun: "system of record for polar place names",
  org: npolar.name,
};

const sak = {
  new: "new case",
  New: "New case",
  Committee: "Place name committee ",
  search: { placeholder: "Search case protocols of place name committee" },
};

const ref = {
  References: "Referansar",
};

export default {
  site,
  "placenames-shell": { name, heading, site },
  drawer: {
    place: "Place names",
    folder: "Cases",
    close: "hide menu",
  },
  case: sak,
  "cases-search": {
    heading: "Polare stadnamn",
    welcome: " ",
    documents: "saker",
    input: {
      placeholder: "Search in the protocols of the name committee",
    },
  },
  country,
  name: placename,
  opensearch: { totalResults: "results" },
  lang: {
    language: "language",
    no: "Norwegian",
    nb: "Norwegian bokmål",
    nn: "Norwegian nynorsk",
    en: "English",
    switch: {
      no: "norsk",
      en: "English",
    },
    native: {
      nn: "nynorsk",
      en: "English",
    },
  },
  "placenames-search": {
    heading: "Polar placenames",
    welcome: " ",
    input: {
      placeholder: "Search: place names, people, history, year",
    },
  },
  ref,
  area: {
    Arktis: "Arctic",
    Antarktis: "Antarctic",
  },
};
