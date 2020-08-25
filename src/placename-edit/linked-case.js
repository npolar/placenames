import { handleRemoveFactory } from "@npolar/patch-event/src/exports.js";

export const linkedCase = ({
  value,
  label,
  idx,
  path,
  valuePathSuffix,
  html,
  t,
}) => html`<span>
  <input-text
    type="number"
    outlined
    label="${label}"
    value=${value}
    path="${path}/${idx}${valuePathSuffix}"
  ></input-text>
  <button-fab
    mini
    label="${t("any.remove")}"
    icon="remove"
    @click="${handleRemoveFactory({ path: `${path}/${idx}` })}"
  >
  </button-fab>
</span>`;
