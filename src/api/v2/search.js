export const searchJSON = async ({ url } = {}) => {
  const r = await fetch(url);
  if (!r || !r.ok) {
    throw `Failed: ${url}`;
  }
  return r.json();
};
