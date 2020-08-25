export const yearPager = ({
  beginLifespanVersion,
  html,
  t,
  next = beginLifespanVersion + 1,
  prev = beginLifespanVersion - 1,
}) =>
  Number.isInteger(beginLifespanVersion)
    ? html` <a href="/?beginLifespanVersion=${prev}">
          <button-icon
            icon="keyboard_arrow_leftt"
            label="${prev}"
          ></button-icon>
        </a>
        <a
          href="/?beginLifespanVersion=${beginLifespanVersion}"
          alt="${beginLifespanVersion}"
        >
          ${beginLifespanVersion}
        </a>
        <a href="/?beginLifespanVersion=${next}">
          <button-icon
            icon="keyboard_arrow_right"
            label="${next}"
          ></button-icon>
        </a>`
    : "";
