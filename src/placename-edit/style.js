import { css } from "lit-element";
export default css`
  .input {
    display: grid;
    grid-template-columns: 1fr;
    padding: 12px;
    grid-gap: 0.5em;
  }

  fieldset {
    border: 0px;
  }

  legend {
    /* padding: 0.2em 0.5em;
    border-width: 0px;
    */
    border-color: var(--mdc-theme-primary);
    color: var(--mdc-theme-primary);
    text-align: left;
    /*border-radius: 4px; */
  }

  .error {
    --mdc-theme-primary: var(--mdc-theme-error);
    --mdc-theme-secondary: var(--mdc-theme-error);
  }
`;
