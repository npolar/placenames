import { base } from "../case/base.js";
export const newCaseButton = ({ host, html, t, cssclass = "primary-fab" }) =>
  host.authorized === true
    ? html`
        <a href="${base}/ny"
          ><button-fab
            class="${cssclass}"
            extended
            icon="add"
            label="${t("case.new")}"
          >
          </button-fab
        ></a>
      `
    : "";
