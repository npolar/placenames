export const casePager = (
  n,
  { prev = n - 1, next = n + 1, maxcase = next, html, t }
) => html`${
  prev > 0
    ? html`<a href=/case/${prev} title="Forrige sak"><button-icon label="Forrige sak" icon="keyboard_arrow_left"></button-icon></a>`
    : html`<button-icon
        disabled
        label="Forrige sak"
        icon="keyboard_arrow_left"
      ></button-icon>`
}
 <span>${t("case.Case")} ${n}</span>
 <a href=/case/${next} title="Neste sak" > <button-icon icon="keyboard_arrow_right" label="Neste sak"></button-icon> </a>`;
