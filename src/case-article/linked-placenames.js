import {
  addPlacenameToCase,
  removePlacenameFromCase,
} from "../api/v2/placename/add-remove-placename-from-case.js";

import { path as placenamePath } from "../placename/path.js";
import { icon as placenameIcon } from "../placename/icon.js";

const op = "replace";
const path = "/placenames";

export const linkedPlacenames = ({
  host,
  number,
  authorized = false,
  placenames = [],
  detected = [],
  area,
  html,
  t,
  ...rest
}) => {
  const sak = rest.case;
  const setOfLinkedNameIDs = new Set(placenames.map(({ id }) => id));
  const mentioned = detected.filter(({ id }) => !setOfLinkedNameIDs.has(id));

  return html`<card-mdc>
    <h2 class="mdc-typography--headline4">
      ${t("name.Placename")}
      ${area
        ? html` (<a
              href="/case/?area=${area}"
              title="Sjå alle saker merka ${area}"
            >
              ${t(`area.${area}`)} </a
            >)`
        : ""}
    </h2>
    <h2 class="mdc-typography--headline5">
      ${t("any.linked_to")} ${t("case.case")}
      (${placenames ? placenames.length : 0})
      ${authorized === true
        ? html`<!--<mwc-textfield outlined icon="place"></mwc-textfield
            > <button-up
              label="@todo button create place name and link it to case ${number}"
            ></button-up> -->`
        : ""}
    </h2>

    <list-twoline
      .entries="${(placenames || []).map((p) => [
        p.name,
        p.beginLifespanVersion,
        {
          href: placenamePath(p),
          icon: placenameIcon(p),
          menu:
            authorized === true
              ? [
                  [
                    t("case.remove_placename_from_case"),
                    () =>
                      removePlacenameFromCase(sak, p, host).then((sak) => {
                        host.case = sak;
                        host.requestUpdate();
                      }),
                  ],
                ]
              : false,
        },
      ])}"
    ></list-twoline>

    ${mentioned && mentioned.length > 0
      ? html` <h2 class="mdc-typography--headline5">
            ${t("nemnt, men ikkje kobla")} (${mentioned.length})
          </h2>
          <list-twoline
            .entries="${mentioned.map((p) => [
              p.name,
              p.beginLifespanVersion,
              {
                href: placenamePath(p),
                icon: placenameIcon({ status: "official", ...p }),
                menu:
                  authorized === true
                    ? [
                        [
                          `${t("any.link")} ${p.name} ${t("any.to")} ${t(
                            "case.case"
                          )} ${number}`,
                          () =>
                            addPlacenameToCase(sak, p, { host }).then((sak) => {
                              host.case = sak;
                              host.afterPatch({
                                op,
                                path,
                                value: sak.placenames,
                              });
                            }),
                        ],
                      ]
                    : false,
              },
            ])}"
          ></list-twoline>`
      : ""}
  </card-mdc>`;
};
