import { PlacenamesSearch } from "./placenames-search/placenames-search.js";
import { PlacenameArticle } from "./placename-article/placename-article.js";
import { PlacenameEdit } from "./placename-edit/placename-edit.js";
import { SignIn } from "./sign-in/sign-in.js";

import caseRoutes from "./case/routes.js";
import refRoutes from "./ref/routes.js";
import placenameRoutes from "./placename/routes.js";
//import placenameRoutes from "./placename/routes.js";

// const generic = endpoints.map(({ path }) => ({
//   path,
//   action: () =>
//     new SearchAny({
//       endpoint: path,
//       heading: path
//     })
// }));

// @todo routing:Handle hashbanr routes for deep links:
// #!/case/407

export const routes = [
  {
    path: "/sign-in",
    action: () => new SignIn(),
  },
  //...generic,

  // {
  //   path: "/sign-in",
  //   action: () => new SignInForm()
  // },
  // {
  //   path: "/error/:id",
  //   action: () => new NotFound()
  // },
  // {
  //   path: "/new/name",
  //   action: () => new NotFound()
  // },

  // {
  //   path: PersonSearch.endpoint,
  //   action: () => new PersonSearch()
  // },
  ...caseRoutes,
  ...refRoutes,
  ...placenameRoutes,
  {
    path: "/new/:id",
    component: "placename-edit",
  },
  {
    path: "/:name/:area/:id",
    component: "placename-article",
  },
  {
    path: "/:name/:area",
    component: "placename-article",
  },
  {
    path: "/:name",
    component: "placename-article",
  },
  {
    path: "/",
    action: () => new PlacenamesSearch(),
  },
  {
    path: "(.*)",
    action: () => `Not Found`,
  },
];
