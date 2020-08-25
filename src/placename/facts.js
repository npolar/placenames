import { firstYear } from "./first-year.js";
import { statusIcon } from "./config.js";
import { isUnique } from "./dupl.js";
import { translate as t } from "../translate/exports.js";
import { path, shareURL } from "./path.js";
const { stringify } = JSON;

export const std = (
  key,
  {
    feature,
    value = feature && key && feature[key] ? feature[key] : undefined,
    href = `/?${key}=${value}`,
    icon,
    prefix = "name.",
  } = {}
) => [t(value), t(`${prefix}${key}`), { icon, href }];

const coordinates = (geometry) =>
  geometry && geometry.type && geometry.type === "Point"
    ? stringify(geometry.coordinates)
    : t("any.missing");

// @todo placename/facts.js: translate terreng
const terrainCategory = (terrain, { lang, t } = {}) =>
  terrain && lang && terrain[lang] ? terrain[lang] : t(`terreng.${terrain}`);

export const facts = (
  {
    name,
    area,
    id,
    geometry,
    terrain,
    status,
    country,
    country_of_authority,
    scar_place_id,
    proposer,
    beginLifespanVersion,
    ...feature
  },
  { lang } = {}
) =>
  [
    [name, t("name.name"), { icon: "translate", href: `/?q=${name}` }],
    [
      t(`lang.${feature["@language"]}`),
      t("lang.language"),
      { icon: "translate", href: `/?@language=${feature["@language"]}` },
    ],
    [
      t(`country.${country}`),
      t("country.country"),

      { icon: "place", href: `/?country=${country}` },
    ],
    std("area", { value: area, icon: "place" }),
    !isUnique({ name, area })
      ? [
          "Ikkje unikt",
          area,
          { icon: isUnique({ name, area }) ? "info" : "warning" },
        ]
      : [],
    [coordinates(geometry), "coordinates", { icon: "place" }],
    [
      t(`name.status.${status}`),
      "status",
      { icon: statusIcon(status), href: `/?status=${status}` },
    ],
    proposer
      ? [
          t("name.Proposer"),
          proposer,
          { icon: "person", href: `/?proposer=${proposer}` },
        ]
      : [],
    [
      terrainCategory(terrain, { t, lang }),
      t("terrain.terrain"),
      { icon: "category", href: `/?terrain=${terrain}` },
    ],
    std("terrain_type", { feature, icon: "category" }),
    [
      t(`country.${country_of_authority}`),
      t("name.country_of_authority"),

      {
        icon: "language",
        href: `/?country_of_authority=${country_of_authority}${
          country_of_authority !== "NO" ? "&status=other" : ""
        }`,
      },
    ],
    [
      beginLifespanVersion ||
        firstYear({
          area,
          status,
          proposer,
          ...feature,
        }),
      t("name.first_use"),
      {
        icon: "history",
        href: `/?beginLifespanVersion=${firstYear({
          area,
          status,
          proposer,
          ...feature,
        })}`,
      },
    ],
    scar_place_id !== undefined
      ? [
          scar_place_id,
          t("scar.SCAR_Place_ID"),
          { icon: "link", href: `/?scar_place_id=${scar_place_id}` },
          //https://data.aad.gov.au/aadc/gaz/scar/search_names_action.cfm?feature_type_code=0&country_id=0&north=-60&south=-90.0&west=-180.0&east=180.0&search_near=&radius=0.5&gazetteers=SCAR&search_text=12146&q=
        ]
      : [],
    [
      decodeURI(shareURL({ name, area, id, status })),
      t("name.URL_for_deling"),
      {
        icon: "share",
        href: shareURL({ name, area, id, status }),
      },
    ],
  ].filter((e) => e.length !== 0);
