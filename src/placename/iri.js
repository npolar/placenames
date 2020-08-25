export const encode = s =>
  encodeURIComponent(String(s || "").replace(/\s/g, "_")).replace(
    /"%27"/g,
    "%20"
  );

export const decode = s =>
  decodeURIComponent(String(s || "").replace(/(\s|_|\+)/g, " ")).replace(
    /%20/g,
    "'"
  );
