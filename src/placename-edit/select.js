import { emit as emitPatchEvent } from "@npolar/patch-event/src/exports.js";

export const select = (
  field,
  options,
  {
    feature,
    html,
    prefix = "name.",
    t,
    icon,
    value = feature && field ? feature[field] : undefined,
    label = t(`${prefix}${field}`),
    op = value === undefined ? "add" : "replace",
    path = `/${field}`,
    required = false,
  }
) => html` <mwc-select
  @action="${(e) => {
    const {
      currentTarget: {
        selected: { value },
      },
    } = e;
    emitPatchEvent(e.currentTarget, {
      op,
      path,
      value: value === "" ? undefined : value,
    });
  }}"
  icon="${icon ? icon : ""}"
  label="${label}"
  activatable
  outlined
  ?required="${required}"
>
  ${options.map(
    (option) =>
      html`<mwc-list-item
        graphic="icon"
        value="${option}"
        ?selected="${value && option === value}"
        ?activated="${value && option === value}"
      >
        ${t(`${prefix}${option}`)}
      </mwc-list-item>`
  )}
</mwc-select>`;
