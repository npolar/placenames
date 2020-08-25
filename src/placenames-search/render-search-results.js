import { path } from "../placename/path.js";
import { statusIcon } from "../placename/config.js";

const headline = ({ name, replaced_by }) =>
  `${name}${
    replaced_by && replaced_by.length > 0
      ? ` ⇒ ${replaced_by.map((p) => p.name).join("/")}`
      : ""
  }`;
const byline = ({ area, status, beginLifespanVersion, t }) =>
  `${area || ""}${beginLifespanVersion ? ` (${beginLifespanVersion})` : ""}`;

import "@npolar/mdc/src/button/exports.js";

export default ({ entries = [], html, t }) =>
  entries.map(
    ({
      id,
      name,
      area,
      beginLifespanVersion,
      status,
      replaced_by,
      ...feature
    }) => html`
      <card-mdc
        headline=${headline({ name, replaced_by })}
        icon=${statusIcon(status)}
        href="${path({ id, name, area })}"
        byline="${byline({ area, status, beginLifespanVersion, t })}"
      >
      </card-mdc>
    `
  );
