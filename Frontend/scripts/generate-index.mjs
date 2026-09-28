import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const buildDir = "build/client";
const manifest = JSON.parse(readFileSync(join(buildDir, ".vite/manifest.json"), "utf8"));

const entryKey = Object.keys(manifest).find((k) => k.includes("entry.client"));
const rootKey = Object.keys(manifest).find((k) => k.includes("root.tsx"));

const entryFile = manifest[entryKey]?.file;
const cssFiles = manifest[rootKey]?.css || [];

const cssLinks = cssFiles.map((f) => `  <link rel="stylesheet" href="/${f}" />`).join("\n");
const moduleScript = `  <script type="module" src="/${entryFile}"></script>`;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BroBalance</title>
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
${moduleScript}
  </body>
</html>
`;

writeFileSync(join(buildDir, "index.html"), html);
console.log("✅ index.html generated at build/client/index.html");
