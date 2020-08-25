import { factory } from "@npolar/idb-store/src/factory.js";

export const caseStore = factory("case", {
  storeOptions: {
    autoIncrement: false
    //keyPath: "@id" breaks idb
  },
  key: o => o["@id"],
  indices: [
    ["area"],
    ["date", "date"],
    ["title", "title"],
    ["meeting", "meeting.number"]
  ]
});

//export const filter
