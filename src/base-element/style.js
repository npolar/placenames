import { css } from "lit-element";
import _mdc from "@npolar/mdc/src/style/shared-scss.js";
import _card from "@npolar/mdc/src/card/card-scss.js";
import _list from "@npolar/mdc/src/list/list-scss.js";
const _app = css`
  a {
    color: var(--mdc-theme-primary);
  }
  .protocol {
    white-space: pre-line;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-start: 0.33em;
    margin-block-end: 0.1em;
    display: flex;
    align-items: center;
  }

  :root,
  html,
  body {
    --mdc-theme-error: #b00020;
    margin: 0;
  }

  button-fab[mini],
  mwc-fab[mini] {
    --mdc-theme-on-secondary: var(--mdc-theme-primary);
    --mdc-theme-secondary: var(--mdc-theme-on-primary);
  }
  button-fab[error],
  mwc-fab[error] {
    --mdc-theme-primary: var(--mdc-theme-error);
  }

  textarea-mdc {
    margin-block-start: 1em;
    margin-block-end: 0.5em;
  }
  card-mdc > *[slot] {
    padding: 4px;
  }

  .app-nav-right {
    position: fixed;
    right: 0rem;
  }

  .primary-fab {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    --mdc-typography-button-text-transform: none;
  }
  .left-fab {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    --mdc-typography-button-text-transform: none;
  }

  .textarea-per-language {
    display: grid;
    grid-template-columns: 1fr;
  }

  .split-2 {
    display: grid;
    grid-template-columns: 1fr;
  }
  @media (min-width: 800px) {
    .split-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  .split-3 {
    display: grid;
    grid-template-columns: 1fr;
  }
  @media (min-width: 800px) {
    .split-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
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

  mwc-textfield,
  mwc-textarea,
  mwc-select,
  list-select,
  text-area,
  input-mdc,
  input-text,
  input-number {
    margin-top: 8px;
  }
`;

export default [_mdc, _card, _list, _app];
