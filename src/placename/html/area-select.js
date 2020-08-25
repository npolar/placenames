import { areas } from "../../vocab/area.js";
import { get as g } from "../translate/exports.js";;

export const areaSelect = (area = "", html) => html`
  <list-select
    path="/area"
    name="area"
    value=${area}
    .options=${areas.map(a => {
      return { value: a };
    })}
    label=${g("vocab.Area")}
  ></list-select>
`;
