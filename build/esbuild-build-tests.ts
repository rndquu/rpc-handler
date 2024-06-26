import esbuild from "esbuild";
import path from "path";
import * as fs from "fs";
import { createDynamicTypes } from "./dynamic-types";

const typescriptEntries = ["tests/mocks/rpc-service.ts", "tests/mocks/rpc-handler.ts", "tests/mocks/handler.ts"];
export const entries = [...typescriptEntries];

export const esBuildContext: esbuild.BuildOptions = {
  entryPoints: entries,
  bundle: true,
  outdir: "dist",
};

async function main() {
  try {
    await buildForEnvironments();
    await buildIndex();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function buildForEnvironments() {
  ensureDistDir();

  await esbuild
    .build({
      ...esBuildContext,
      tsconfig: "tsconfig.tests.json",
      platform: "node",
      outdir: "dist/tests/mocks",
      format: "cjs",
    })
    .then(() => {
      console.log("Node.js esbuild complete");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

async function buildIndex() {
  await esbuild.build({
    entryPoints: ["index.ts"],
    bundle: true,
    format: "cjs",
    outfile: "dist/index.js",
  });

  console.log("Index build complete.");
}

function ensureDistDir() {
  const distPath = path.resolve(__dirname, "dist");
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
}

createDynamicTypes().then(main).catch(console.error);
