import { h1, h2 } from "./h.js";
import { html } from "lit-element";
import { classMap } from "lit-html/directives/class-map.js";

const _li = (item, { liclass, href, text } = {}) =>
  html` <a href=${href(item)}><li class="${liclass}">${text(item)}</li></a> `;

export const ul = (
  list,
  {
    header = "",
    icon = "url",
    href = (r) => `/${r["@id"]}`,
    text = (r) => r.name,
    sort = (a, b) => text(a).localeCompare(text(b)),
    liclass = "mdc-list-item",
  } = {}
) => html`
  <ul class="mdc-list">
    ${(list || []).sort(sort).map((item) => _li(item, { href, text, liclass }))}
  </ul>
`;

export const empty = (a) => {
  const isEmpty =
    a === undefined || a === null || a.length === 0 || a.size === 0;
  console.log(isEmpty, a);
  return isEmpty;
};

export const links = (
  list,
  {
    href = (r) => r.href || `/${r["@id"]}`,
    text = (r) => r.text || r.name,
    sort = (a, b) => text(a).localeCompare(text(b)),
    liclass = "",
    i = 0,
    size = (list || []).length,
    //sep = (i, size) => "", //size === 0 || i === size - 1 ? "": html`,`,
    li = (item, i) => html`
      <a href=${href(item)}>
        <li class=${liclass}>${text(item)}</li>
      </a>
    `,
  } = {}
) =>
  html`
    <ul style="">
      ${(list || []).sort(sort).map(li, i++)}
    </ul>
  `;

export const li = ({
  text,
  href = `/?q=${text}`,
  icon = "bookmark",
  label = text,
  activated = false,
} = {}) => html`
  <a href="${href}" class="mdc-list-item">
    <li
      class="mdc-list-item ${classMap({
        "mdc-list-item--activated": activated,
      })}"
    >
      <button-icon aria-hidden="true" icon=${icon}></button-icon>
      <span class="mdc-list-item__text">${text}</span>
    </li>
  </a>
`;
