export const goto = (
  href,
  {
    state = null,
    title = "",
    host = window,
    method = "replaceState",
    event = new PopStateEvent("popstate"),
  } = {}
) => {
  history[method](state, title, href);
  host.dispatchEvent(event);
};
