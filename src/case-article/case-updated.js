// data layer
import { getCaseByNumber } from "../api/v2/placename/case/get.js";
import { findCaseByNumber } from "../api/v2/placename/case/search.js";

import { newCase } from "../api/v2/placename/case/new.js";
import { findPlacenamesLinkingToCase } from "../api/v2/placename/feature/search.js";

// process
import { detect } from "../placename/detect.js";
import { areas } from "../vocab/area.js";
import { mark } from "../html/linkify.js";

// UI
import { get as t } from "../translate/exports.js";
import {
  addFeatureGroupToMap,
  addCirclesToFeatureGroup,
} from "../leaflet/add-feature-group.js";

const atLeastOne = (placenames) => placenames && placenames.length > 0;

const hasPointGeometry = ({ geometry } = {}) =>
  geometry &&
  geometry.coordinates &&
  geometry.coordinates.length > 1 &&
  geometry.type == "Point";

const everyHasNameIdGeometry = (placenames) =>
  atLeastOne(placenames) &&
  placenames.every((p) => p && p.name && p.id && hasPointGeometry(p));

const markText = (text, list) => {
  const marked = mark((text || "").split(/-\n/).join(""), { list });
  console.warn({ list });
  return marked;
};

let isDetected = false;

// Composable [LitElement update lifecycle](https://lit-element.polymer-project.org/guide/lifecycle#update) method for CaseArticle / CaseEdit
// When number and no case => fetch and set case
// When case => detect names in text (protocol and comment), mark these like [Svalbard] and dereference
// When placenames (dereferenced features from case.placenames) => add red circles to map
// When detected (dereferenced features detected in protocol/comment) => add blue circles to map
export const caseUpdated = async (p, host) => {
  if (p.has("number")) {
    if (!host.case || host.case["@id"] !== host.number) {
      if (!["new", "edit", "ny", "skriv"].includes(host.number)) {
        host.case = await getCaseByNumber(host.number, { host });
      }
    }
  }
  if (p.has("case") && host.case && host.case["@id"]) {
    host.number = host.case["@id"];
    let { placenames, protocol, comment, area } = host.case;
    const text = `${protocol || ""} ${comment || ""}`.trim();
    // Detect and mark placenames in texts, eg: [Svalbard]
    if (text && text.length) {
      const unmarked = text.replace(/[\[\]]/g, "");
      const detected = await detect(unmarked + "\n\n", {
        area,
        dereference: true,
      });
      // Add names to the detected list.
      // Names already marked (inside []) won't be detected on re-runs
      // Notice: Only adding means that it's not possibe to remove detected by eg. emptying protocol text but this is allright since it's fixed upon save
      // Also non-official names are not detected (and therefore cannot be linked to case)
      if (detected && detected.length > 0) {
        const alreadyDetectedIDSet = new Set(
          (host.detected || []).map(({ id }) => id)
        );

        const notAlreadyDetected = detected.filter(
          ({ id }) => !alreadyDetectedIDSet.has(id)
        );

        host.detected = [...(host.detected || []), ...notAlreadyDetected];
        const detectedNames = host.detected.map(({ name }) => name);

        const markedProtocol = markText(protocol, detectedNames);
        const markedComment = markText(comment, detectedNames);

        if (markedProtocol !== protocol || markedComment !== comment) {
          host.case.protocol = markedProtocol;
          host.case.comment = markedComment;
          host.requestUpdate();
        }
      }
    }

    if (false || everyHasNameIdGeometry(placenames)) {
      // Update placenames property in host element to trigger add to map
      host.placenames = placenames;
    } else {
      // Fetch name,id,gemetry for all linked names into case
      const {
        results,
        stats: { totalResults },
      } = await findPlacenamesLinkingToCase(host.case["@id"]);
      //const casePlacenameIDs = new Set(placenames || [].map((p) => p.id));
      // Merge in placenames that links to host case
      if (results && totalResults === results.length && totalResults > 0) {
        console.warn({ results });
        host.case.placenames = results;
        host.placenames = results;
        host.requestUpdate();
      }
    }
  }
  if (p.has("placenames") && host._map) {
    const name = `${t(`any.linked_to`)} ${t("case.case")}`;
    const { placenames, linkedPlacenamesFeatureGroup } = host;
    const placenamesWithPoint = placenames.filter((p) => hasPointGeometry(p));
    if (placenamesWithPoint && placenamesWithPoint.length > 0) {
      if (!linkedPlacenamesFeatureGroup) {
        host.linkedPlacenamesFeatureGroup = addFeatureGroupToMap({
          map: host._map,
          features: placenamesWithPoint,
          name,
        });
      } else {
        addCirclesToFeatureGroup({
          features: placenamesWithPoint,
          featureGroup: linkedPlacenamesFeatureGroup,
        });
      }
    }
  }

  if (p.has("detected") && host._map) {
    const { detected, detectedPlacenamesFeatureGroup } = host;
    const options = { color: "rgb(0, 109, 179)", radius: 8 };
    if (detected && detected.length > 0) {
      const features = detected;
      if (!detectedPlacenamesFeatureGroup) {
        host.detectedPlacenamesFeatureGroup = addFeatureGroupToMap({
          map: host._map,
          features,
          name: `${t(`name.mentioned`)}`,
          options,
        });
      } else {
        addCirclesToFeatureGroup({
          features,
          featureGroup: detectedPlacenamesFeatureGroup,
          options,
        });
      }
    }
  }
};
