// Data model
import { terreng } from "../vocab/terrain.js";
import { namedPlaceTypes } from "../vocab/inspire.js";
import { statuses } from "../placename/schema2.js";
import { countries } from "../vocab/country.js";

import { h4 } from "@npolar/mdc/src/h.js";
import { select } from "./select.js";

export const factsEdit = ({ feature, html, t }) => html` <card-mdc outlined>
  <fieldset class="input">
    <legend slot="header">
      ${h4(t("name.facts"), { html })}
    </legend>
    ${select("status", statuses, {
      value: feature ? feature.status : "",
      label: "status",
      prefix: "status.",
      html,
      t,
    })}
    ${select("terrain_type", namedPlaceTypes, {
      value: feature ? feature.terrain_type : "",
      label: "INSPIRE-type",
      html,
      t,
    })}
    ${select("terrain", terreng, {
      value: feature.terrain,
      html,
      prefix: "terrain.",
      t,
    })}
    ${select("country", ["", ...countries], {
      value: feature.country,
      html,
      prefix: "country.",
      t,
    })}
    <input-text
      outlined
      label="${t("name.scar_place_id")}"
      placeholder="${t("name.scar_place_id")}"
      null
      value=${feature.scar_place_id}
      path="/scar_place_id"
    >
    </input-text>

    ${select("country_of_authority", ["", ...countries], {
      value: feature.country_of_authority,
      prefix: "country.",
      html,
      t,
    })}
  </fieldset>
</card-mdc>`;
