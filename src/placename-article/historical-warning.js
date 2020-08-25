// 2ine HISTORICAL + begin/end lifespan
import { statusIcon } from "../placename/config.js";

const lifespanText = ({
  beginLifespanVersion,
  endLifespanVersion,
  status,
  t,
}) =>
  t(
    `${t("name.used")} ${beginLifespanVersion || "?"} – ${
      endLifespanVersion || "?"
    }`
  );

export const historicalWarning = (
  { name, area, status, beginLifespanVersion, endLifespanVersion },
  { t, html }
) =>
  html`<list-twoline
    noninteractive
    .entries=${[
      [
        `${t(`name.status.${status}`)} ${t("name.placename")}`,
        `${lifespanText({
          beginLifespanVersion,
          endLifespanVersion,
          status,
          t,
        })}`,
        { icon: statusIcon(status) },
      ],
    ]}
  >
  </list-twoline>`;
