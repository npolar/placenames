import { handleRemoveFactory } from "@npolar/patch-event/src/exports.js";

export const linkedReference = ({
  object,
  value,
  idx,
  path,
  valuePathSuffix,
  html,
  t,
}) => html`<span>
  <input-text
    outlined
    label="${t("ref.title")}"
    value=${value}
    path="${path}/${idx}${valuePathSuffix}"
  ></input-text>

  <input-number
    outlined
    label="ident"
    value=${object.ident}
    path="${path}/${idx}/ident"
  ></input-number>

  <button-fab
    mini
    label="${t("any.remove")}"
    icon="remove"
    @click="${handleRemoveFactory({ path: `${path}/${idx}` })}"
  >
  </button-fab>
</span>`;
