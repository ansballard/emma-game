import { basename } from "path";
import chokidar from "chokidar";
import esbuild from "esbuild";
import mri from "mri";
import { gray, red, green, yellow } from "colorette";

const { watch, verbose: _verbose, nomodule, minify } = mri(process.argv.slice(2), {
  alias: {
    w: "watch",
    v: "verbose",
    n: "nomodule",
    m: "minify",
  },
  boolean: ["watch", "verbose", "nomodule", "minify"],
});

const verbose = !_verbose ? () => null : (_) => console.log(gray(_));

const watcher = watch
  ? chokidar.watch("src", {
      persistent: true,
    })
  : {};

const esbuildOptions = {
  entryPoints: ["src/index.jsx"],
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
    outfile: "public/module/index.min.js",
    format: "iife",
    target: "es2020",
    minify,
  });
  if (nomodule) {
    await service.build({
      ...esbuildOptions,
      format: "iife",
      target: "es2015",
      outfile: "public/nomodule/index.min.js",
      minify,
    });
  }
  const [s, ms] = process.hrtime(hr);
  const time = Math.floor(ms / 1000000);
  const format = time < 100 ? green : time < 500 ? yellow : red;
  console.log(`⏱️  ${format(time > 999 ? `${s}s` : `${time}ms`)} ${gray(basename(path))}`);
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
  console.log("👀 ./src");

  watcher.on("change", async (path) => {
    try {
      await build({ service, path });
    } catch (e) {
      console.error(red(`Failed to rebuild after ${path} change`));
      console.error(e);
    }
  });
})();
