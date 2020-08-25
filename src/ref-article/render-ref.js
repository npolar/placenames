import { h1, h2, h3 } from "../html/h.js";
import "@npolar/mdc/src/button/exports.js";

import { Card } from "@npolar/mdc/src/card/exports.js";
import { path } from "../placename/path.js";

const renderNamesForRef = ({ ident, title, content, year, source_id }) => ``;
// <card-mdc>
//   <div slot="header">
//     <h2 class="mdc-typography--headline5">
//       <button-icon id="Referansar" icon="place"> </button-icon>
//
//       ${t("name.Placenames")}
//     </h2>
//   </div>
//   <ol-mdc
//     .list=${names}
//     .text=${(p) => p.name}
//     .text2=${(p) => p.area}
//     .href=${path}
//   ></ol-mdc>
// </card-mdc>

export const renderRef = (ref, { html, t, names = [], maps = [] } = []) =>
  html`

  <button-up label="${t("any.back")}" icon="arrow_back"> </button-up>

    <card-mdc>
      <div slot="header">
        <a href="/?q=${ref.title}"><h2 class="mdc-typography--headline4">
        ${ref.title}
        </h2></a>
        <a href="/?q=${ref.year}">${ref.year}</a>
      </div>
      <cite>
        <p>${ref.content}</p>
      <//cite>
    </card-mdc>
    ${names ? renderNamesForRef(ref) : ""}
  `;
