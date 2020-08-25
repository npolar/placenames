import { css } from "lit-element";
export default css`

.center {
  display: grid;
  align-items: center;
  justify-items: center;
}
.edit-box {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.5em;

}

mwc-textfield, mwc-textarea, mwc-select, list-select, text-area {
  margin: 16px;

}

  .primary-map > div {
    --leaflet-height = 200px;
    width: 100%;
    height: 400px;
  }


  [role="textbox"]:hover {
    min-height: 1em;
    border-bottom: navy inset 4px;
    background: azure;
  }
  [role="textbox"]:empty {
    border-color: var(--mdc-theme-error);
    display: block;
  }
  [role="textbox"]:lang(nn):empty::before {
    content: "Tekst manglar";
  }
  [role="textbox"]:lang(en):empty::before {
    content: "Missing text";
  }
  /*
  Set *:focus outline – removes orange focus indication */
  *:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
  }

  th {
    margin-block-start: 0.33em;
    margin-block-end: 0.1em;
    display: flex;
    align-items: center;
  }
`;
