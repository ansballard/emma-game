import { basename } from "path";
import { createServer } from "http";
import chokidar from "chokidar";
import esbuild from "esbuild";
import mri from "mri";
import serveHandler from "serve-handler";
import { gray, red, green, yellow, cyan, blue } from "colorette";

import { blowfish, tinyLittleFish } from "./src/emojis.mjs";

const { watch, serve, public: rawPublic, port, verbose: _verbose, nomodule, minify, _: entryPoints } = mri(process.argv.slice(2), {
  alias: {
    w: "watch",
    s: "serve",
    v: "verbose",
    n: "nomodule",
    m: "minify",
    p: "port",
  },
  boolean: ["watch", "verbose", "serve", "nomodule", "minify"],
  default: {
    port: 5000,
    public: "public",
  },
});

const verbose = !_verbose ? () => null : (_) => console.log(gray(_));
const _public = rawPublic && rawPublic.slice(-1) === "/" ? rawPublic.slice(0, -1) : rawPublic;

const watcher = watch
  ? chokidar.watch("src", {
      persistent: true,
    })
  : {};

if(serve) {
  createServer((request, response) => (
    serveHandler(request, response, {
      public: _public,
    })
  )).listen(port, () => {
    console.log(cyan(`Serving ${_public} at http://localhost:${port}`));
  });
}

const esbuildOptions = {
  entryPoints,
  bundle: true,
  platform: "browser",
  sourcemap: true,
  jsxFactory: "h",
  jsxFragment: "Fragment",
  // loader: "jsx",
};
async function build({ service, path }) {
  const hr = process.hrtime();
  const res = await service.build({
    ...esbuildOptions,
    outdir: `${_public}/module`,
    format: "esm",
    target: "es2020",
    minify,
  });
  if (nomodule) {
    await service.build({
      ...esbuildOptions,
      format: "iife",
      target: "es2015",
      outdir: `${_public}/nomodule`,
      minify,
    });
  }
  const [s, ms] = process.hrtime(hr);
  const time = Math.floor(ms / 1000000);
  const format = time < 100 ? green : time < 500 ? yellow : red;
  console.log(`${tinyLittleFish}  ${format(time > 999 ? `${s}s` : `${time}ms`)} ${gray(basename(path))}`);
  return res;
}

(async () => {
  const service = await esbuild.startService();
  await build({ service, path: "init" });

  if (!watch) {
    await service.stop();
    process.exit(0);
  }

  verbose("Started esbuild service");
  console.log(`${blowfish} ./src ${blue("gfggygygyrtugyyty")}`);

  watcher.on("change", async (path) => {
    try {
      await build({ service, path });
    } catch (e) {
      console.error(red(`Failed to rebuild after ${path} change`));
      console.error(e);
    }
  });
})();
