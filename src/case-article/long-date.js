export const longDate = (
  datestring,
  {
    locales = "default",
    options = {
      dateStyle: "long",
    },
  } = {}
) => {
  try {
    const dt = new Date(datestring);
    return new Intl.DateTimeFormat(locales, options).format(dt);
  } catch (_) {}
  return datestring;
};
