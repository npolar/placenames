import { handleAddFactory } from "@npolar/patch-event/src/exports.js";

export const arrayEdit = ({
  headline = "",
  collection = [],
  html,
  label,
  t,
  edit,
  valuePathSuffix,
  extractValue,
  create = () => ({}),
  path = "/collection",
}) => {
  if (!path.startsWith("/")) {
    throw "Invalid path";
  }
  let collectionCounter = 0;
  const size = collection ? collection.length : 0;

  return html`
    <card-mdc outlined>
      <fieldset class="input">
        <legend slot="header">
          <h4 class="mdc-typography--headline5">
            ${headline}
          </h4>

          <button-fab
            mini
            label="${t("any.add")}"
            icon="add"
            @click="${handleAddFactory({
              path: path + "/-",
              value: create(),
            })}"
          >
          </button-fab>
        </legend>
        ${collection.map((c) => {
          const idx = collectionCounter++;
          const value = extractValue(c);

          return edit({
            object: c,
            value,
            label,
            path,
            valuePathSuffix,
            idx,
            size,
            html,
            t,
          });
        })}
      </fieldset>
    </card-mdc>
  `;
};
