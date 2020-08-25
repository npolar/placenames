export const areaDuplicateWarning = ({ name, area, replaced_by, t, html }) =>
  html`<ul class="mdc-list">
    <li class="mdc-list-item">
      <button-icon icon="warning"></button-icon
      ><a href="/?name=${name}&area=${area}">${t("Not_unique")}</a>
    </li>
  </ul>`;
