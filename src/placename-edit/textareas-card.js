const value = ({ feature, field, lang }) =>
  feature && feature[field] && feature[field][lang] ? feature[field][lang] : "";

const rows = (text) =>
  text && text.length ? parseInt(text.length / 100) + 1 : 1;

export const textareasCard = (
  field,
  {
    feature,

    html,
    t,
  }
) => html`
  <card-mdc outlined>
    <fieldset>
      <legend slot="header">
        <h1 class="mdc-typography--headline5">
          ${t(`name.${field}`)}
        </h1>
      </legend>
      ${["nn", "en"].map(
        (lang) => html`<text-area
          path="/${field}/${lang}"
          value="${value({ feature, field, lang })}"
          fullwidth
          outlined
          charCounter
          placeholder="${lang === "en" ? field : t(`name.${field}`)} [${lang}]"
          maxlength="100000"
          rows="${rows(value({ feature, field, lang }))}"
        ></text-area>`
      )}
    </fieldset>
  </card-mdc>
`;
