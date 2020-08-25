import { html } from "lit-element";

export const h1 = (text, { html, n = 4 } = {}) => html`
  <h1 class="mdc-typography--headline${n}">${text}</h1>
`;

export const h2 = (text, { icon, n = 5 } = {}) => _h(text, { icon, n });

export const h3 = (text, { icon, n = 6 } = {}) => _h(text, { icon, n });

const _h = (text, { icon, n }) =>
  html`
    <h2 class="mdc-typography--headline${n}">
      ${icon
        ? html`
            <ic-on class="mdc-list-item__graphic" role="presentation">
              ${icon}
            </ic-on>
          `
        : ""}
      ${text}
    </h2>
  `;
