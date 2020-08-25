import { handleRemoveFactory } from "@npolar/patch-event/src/exports.js";

export const linkedName = ({
  object,
  value,

  idx,
  path,
  valuePathSuffix,
  html,
  t,
}) => html`<span>
  <span>
    ${
      value && value.length && object && object["@id"] && object["@id"].length
        ? html` <input-text
            outlined
            label="${t("name.name")}"
            .value=${value}
            path="${path}/${idx}${valuePathSuffix}"
          ></input-text>`
        : html`
            <input-text
              outlined
              label="${t("name.name")}"
              value=${value}
              path="${path}/${idx}${valuePathSuffix}"
            ></input-text>
            <input-text
              outlined
              label="UUID"
              value=${object["@id"]}
              path="${path}/${idx}/@id"
            ></input-text>
          `
    }</span>

    <button-fab
      mini
      label="${t("any.remove")}"
      icon="remove"
      @click="${handleRemoveFactory({ path: `${path}/${idx}` })}"
    >
    </button-fab> </span
></span>`;
