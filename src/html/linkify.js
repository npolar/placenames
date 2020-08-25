import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { path } from "../placename/path.js";
// Thanks https://exploringjs.com/impatient-js/ch_regexps.html#escapeForRegExp
const escapeRegex = (s) => String(s).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
// @todo mark sould not mark inside text [Kvadehuken] og [Kongsfjord]neset.
// => could sort on length?
export const mark = (
  s,
  {
    list = [],
    params = {},
    prefix = () => "[",
    suffix = () => "]",
    escape = escapeRegex,
  } = {}
) => {
  for (const needle of list) {
    const re = new RegExp(`(?<name>${escape(needle)})`);

    const m = re.exec(s);
    if (m) {
      const {
        index,
        groups: { name, pre, after },
      } = m;
      const notRE = new RegExp(`(${escape(prefix(name))})${escape(needle)}`);
      const not = notRE.exec(s);
      const alreadyPrefixed = not && not[0] ? true : false;

      if (!alreadyPrefixed) {
        s = s.replace(
          re, // not greedy, just replace first match
          `${prefix(name, params)}${name}${suffix(name, params)}`
        );
      }
    }
  }
  return s;
};

export const linkify = (s, { list, params }) => {
  if (!list) {
    return s;
  }
  const markdown = mark(s, {
    list,
    prefix: (match) =>
      `<a href="${path({ name: match })}/${
        params && params.area && match !== params.area
          ? params.area.substring(0, 1)
          : ""
      }">`,
    suffix: (match) => `</a>`,
  });
  let html = markdown
    .replace(/\/S">/g, '/Svalbard">')
    .replace(/\/J">/g, '/Jan_Mayen">')
    .replace(/\/D">/g, '/Dronning_Maud_Land">')
    .replace(/\/B">/g, '/Bouvetøya">')
    .replace(/\/P">/g, '/Peter_I_Øy">')
    .replace(/\/[A-Z]{1}">/g, '/">');

  // const splitted = markdown.split("[").map((part) => {
  //   console.warn(part);
  // });
  // const m = /\[(?<name>[^][,\s]+)\]/g.exec(markdown);
  // if (m) {
  //   console.warn(m.groups.name);
  // }
  return unsafeHTML(html);
};
