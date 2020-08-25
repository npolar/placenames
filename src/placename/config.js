import { SV, JM, BV, P1, DML } from "../vocab/area.js";
import { isUnique } from "../placename/dupl.js";
export const statusIcon = (status) => {
  const m = new Map([
    ["official", "place"],
    ["historical", "history"],
    ["standardised", "info"],
    ["other", "warning"],
    ["draft", ""],
    ["suggestion", "record_voice_over"],
  ]);
  return m.has(status) ? m.get(status) : "place";
};

// @future if offline and service worker caches tiles => set zoom to a small number
export const zoomForArea = (area, dflt = 7) => {
  const m = new Map([
    [SV, 6],
    [JM, 7],
    [BV, 11],
    [P1, 9],
    [DML, 12],
    ["Antarktis", 3],
    ["Arktis", 3],
  ]);
  return m.has(area) ? m.get(area) : dflt;
};

export const circleSize = (zoom) => (2000 * zoom) / 5;

export const centerForArea = (area) => {
  const m = new Map([
    [SV, [10, 10]],
    [JM, [79, 10]],
    [BV, [79, 10]],
    [P1, [79, 10]],
    [DML, [0, -70]],
  ]);
  return m.has(area) ? m.get(area) : [0, 0];
};
