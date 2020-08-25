import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { eslint } from "rollup-plugin-eslint";
import { terser } from "rollup-plugin-terser";
import liveserver from "rollup-plugin-live-server";
import pkg from "./package.json";
const exclude = ["@npolar/mdc", "@npolar/idb-store", "@npolar/placenames"];
const deps = [...Object.keys(pkg.dependencies)].filter(
  (name) => !exclude.includes(name)
);

const input = ["src/placenames-app.js", ...deps];

const dir = "dist";
const format = "esm";
const output = { format, dir };
const terserConfig = {
  parse: {
    html5_comments: false,
  },
  output: {
    comments: false,
  },
};
let plugins = [nodeResolve(), commonjs()];

const app = {
  input,
  output,
  plugins,
};

const { ROLLUP_WATCH } = process.env;
if (ROLLUP_WATCH) {
  const liveserverConfig = {
    root: "dist",
    open: false,
    file: "index.html",
    port: 1596,
  };

  plugins = [...plugins, terser(terserConfig), liveserver(liveserverConfig)];
} else {
  plugins = [...plugins, eslint(), terser(terserConfig)];
}

// const worker = {
//   input: "src/worker.js",
//   output: { format, file: `${dir}/worker.js` },
//   plugins
// };

// const workerFlexsearch = {
//   input: "src/placenames-search/worker-placenames-search.js",
//   output: { format, file: `${dir}/worker-placenames-search.js` },
//   plugins
// };

export default [app];
