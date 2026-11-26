#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const manifestPath = join(scriptDir, "r2-media-manifest.json");
const target = process.argv.includes("--local") ? "local" : process.argv.includes("--remote") ? "remote" : null;
const confirmed = process.argv.includes("--confirm");
const warningBytes = 5_000_000_000;
const uploadLimitBytes = 8_000_000_000;
const cacheControl = "public, max-age=31536000, immutable";

function fail(message, code = 1) {
  console.error(`\nMedia migration stopped: ${message}`);
  process.exit(code);
}

function runNpx(args, label) {
  console.log(`\n${label}`);
  const result = spawnSync("npx", args, { cwd: projectRoot, stdio: "inherit" });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) fail(`${label} failed with exit code ${result.status ?? "unknown"}.`);
}

if (!target) {
  fail("Choose exactly one target: --local or --remote. No uploads were attempted.");
}
if (target === "remote" && !confirmed) {
  fail("Remote writes require an explicit --confirm flag. Run npm run media:upload:remote -- --confirm after logging in with Wrangler.");
}
if (!existsSync(manifestPath)) fail("The R2 media manifest is missing.");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.bucket !== "ses-official-media" || !Array.isArray(manifest.assets)) {
  fail("The media manifest does not match the expected SES bucket format.");
}

let totalBytes = 0;
const assets = manifest.assets.map((asset) => {
  if (typeof asset.source !== "string" || typeof asset.key !== "string" || typeof asset.contentType !== "string") {
    fail("The manifest contains an invalid asset entry.");
  }
  const source = resolve(projectRoot, asset.source);
  const publicRoot = resolve(projectRoot, "public") + sep;
  if (!source.startsWith(publicRoot) || isAbsolute(asset.source)) {
    fail(`Asset source is outside the local public directory: ${asset.source}`);
  }
  if (!existsSync(source)) fail(`Required source media is missing: ${asset.source}`);
  const actualBytes = statSync(source).size;
  if (actualBytes !== asset.sizeBytes) {
    fail(`File size changed since the manifest was created: ${asset.source}. Rebuild the manifest before uploading.`);
  }
  if (!asset.key.startsWith("v1/brand/") && !asset.key.startsWith("v1/images/")) {
    fail(`Unexpected R2 object key: ${asset.key}`);
  }
  totalBytes += actualBytes;
  return { ...asset, source, actualBytes };
});

if (totalBytes > uploadLimitBytes) {
  fail(`This batch is ${(totalBytes / 1e9).toFixed(3)} GB, above the 8 GB application stop limit.`);
}
if (assets.length === 0) fail("The manifest is empty.");

console.log(`\nTarget: ${target.toUpperCase()}`);
console.log(`Bucket: ${manifest.bucket}`);
console.log(`Objects: ${assets.length}`);
console.log(`Batch size: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
console.log(`Estimated R2 Class A writes: ${assets.length}`);
if (totalBytes >= warningBytes) {
  console.warn("WARNING: This batch has reached the 5 GB storage-warning threshold.");
} else {
  console.log(`Storage warning threshold: 5 GB. Batch is ${(totalBytes / warningBytes * 100).toFixed(3)}% of that threshold.`);
}
console.log(`Upload hard limit: ${(uploadLimitBytes / 1e9).toFixed(0)} GB.`);

// Preload Wrangler once. The first run may install Wrangler into the npm cache.
runNpx(["--yes", "wrangler@4", "--version"], "Checking Wrangler CLI");

for (const [index, asset] of assets.entries()) {
  const args = [
    "--yes", "wrangler@4", "r2", "object", "put",
    `${manifest.bucket}/${asset.key}`,
    "--file", asset.source,
    "--content-type", asset.contentType,
    "--content-disposition", "inline",
    "--cache-control", cacheControl,
    "--force",
    target === "local" ? "--local" : "--remote",
  ];
  if (target === "local") args.push("--persist-to", ".cloudflare/state/v3");
  runNpx(args, `Uploading ${index + 1}/${assets.length}: ${asset.source}`);
}

// Read back one object to verify that the selected bucket is reachable and has the expected bytes.
const sample = assets[0];
const tempDir = mkdtempSync(join(tmpdir(), "ses-r2-verify-"));
const tempFile = join(tempDir, basename(sample.source));
try {
  const args = [
    "--yes", "wrangler@4", "r2", "object", "get",
    `${manifest.bucket}/${sample.key}`,
    "--file", tempFile,
    target === "local" ? "--local" : "--remote",
  ];
  if (target === "local") args.push("--persist-to", ".cloudflare/state/v3");
  runNpx(args, `Verifying uploaded object: ${sample.key}`);
  if (!existsSync(tempFile) || statSync(tempFile).size !== sample.actualBytes) {
    fail("The verification download size does not match the original file.");
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log("\nR2 media upload completed and one object was read back successfully.");
console.log("Do not delete the local public/ source files until the website has been tested against this target.");
console.log("Apply migrations 0002 and 0003 to the matching D1 environment after this upload.");
