#!/usr/bin/env node
/**
 * Publish the latest cpp-ide APK as a GitHub Release asset and print
 * a copy-paste markdown snippet for the download button in
 * content/cpp-ide.md.
 *
 * Usage:
 *   pnpm upload                     # uses DEFAULT_APK below
 *   node upload-apk.js <path.apk>   # explicit path override
 *
 * Why GitHub Releases vs. UploadThing / blob storage:
 *   UploadThing's default file-type allowlist rejects APKs by MIME
 *   and its per-file size caps on the allowed types are well below
 *   the 140 MB APK we ship. GitHub Releases takes binaries up to 2
 *   GB per asset for free, gives us a stable direct-download URL,
 *   and lets us keep an append-only history of what users installed
 *   at any point in time without building that plumbing ourselves.
 *
 * URL shape:
 *   https://github.com/<owner>/<repo>/releases/download/<tag>/<asset>
 *
 *   We use a stable tag (`apk-latest`) and overwrite the asset with
 *   `gh release upload --clobber` on every run, so the URL the blog
 *   embeds never changes across releases. If you ever want versioned
 *   URLs too, add a second `gh release create v<semver>` step.
 */

import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Target repo for the release. Passed to `gh` as `-R owner/repo` so
// the script works regardless of which repo the shell happens to be
// in — this script lives in the blog repo, but uploads to the app
// repo where source history and issues live.
const REPO = "haleemzahid/cpp-ide-android";
const TAG = "apk-latest";
const ASSET_NAME = "cpp-ide.apk";

// Default APK location is the adjacent maui repo. Override by passing
// the path, e.g. `node upload-apk.js ./some-other.apk`.
const DEFAULT_APK =
    "D:/repos/maui/cpp-ide-android/ide/app/build/outputs/apk/debug/app-debug.apk";
const apkPath = path.resolve(process.argv[2] ?? DEFAULT_APK);

if (!fs.existsSync(apkPath)) {
    console.error(`APK not found: ${apkPath}`);
    console.error("Pass the path as an argument or build the debug APK first.");
    process.exit(2);
}

// Run a `gh` command, printing the invocation and returning stdout.
// Using execFileSync (no shell) means we don't have to worry about
// quoting apk paths that contain spaces or Windows drive letters.
function gh(args, opts = {}) {
    console.log(`  $ gh ${args.join(" ")}`);
    return execFileSync("gh", args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "inherit"],
        ...opts,
    }).trim();
}

function ghSafe(args) {
    try {
        return gh(args);
    } catch {
        // The caller differentiates "release doesn't exist" from real
        // errors by how the rest of the script behaves; we just need
        // the "not found" case to not halt the program.
        return null;
    }
}

function main() {
    // Sanity: make sure `gh` is on PATH and we're logged in. A missing
    // CLI is a much clearer error up front than a confusing exec
    // failure mid-upload.
    try {
        execSync("gh --version", { stdio: "ignore" });
    } catch {
        console.error("gh CLI not found. Install from https://cli.github.com/");
        process.exit(2);
    }
    try {
        execSync("gh auth status", { stdio: "ignore" });
    } catch {
        console.error("gh is not logged in. Run `gh auth login` first.");
        process.exit(2);
    }

    const stat = fs.statSync(apkPath);
    const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
    console.log(`→ Publishing ${path.basename(apkPath)} (${sizeMB} MB)`);
    console.log(`  from ${apkPath}`);
    console.log(`  to   ${REPO} @ ${TAG}/${ASSET_NAME}`);

    // Ensure the stable release exists. `gh release view` exits
    // non-zero when the tag doesn't exist, which is our signal to
    // create it rather than update it.
    const existing = ghSafe(["release", "view", TAG, "-R", REPO]);
    if (!existing) {
        console.log(`→ Creating release ${TAG}`);
        gh([
            "release", "create", TAG,
            "-R", REPO,
            "--title", "cpp-ide APK (latest)",
            "--notes", "Direct-download APK for https://shahidkhan.dev/cpp-ide. " +
                "Overwritten by scripts/upload-apk/upload-apk.js on each build.",
            "--latest=false",
        ]);
    } else {
        console.log(`→ Release ${TAG} already exists`);
    }

    // `gh release upload --clobber` replaces the asset in place if
    // one with the same filename exists, so the public URL is stable
    // across releases. Without `--clobber`, the second run would
    // error out and we'd have two .apk files on the release page.
    console.log("→ Uploading asset (this can take a minute or two)…");
    // Pass the path with an explicit display name via `file#display`
    // so the asset is always `cpp-ide.apk` regardless of the source
    // filename being `app-debug.apk`.
    const assetSpec = `${apkPath}#${ASSET_NAME}`;
    gh(["release", "upload", TAG, assetSpec, "-R", REPO, "--clobber"]);

    const url = `https://github.com/${REPO}/releases/download/${TAG}/${ASSET_NAME}`;
    console.log("");
    console.log("──────────────────────────────────────────────");
    console.log(`Public URL: ${url}`);
    console.log(`Size:       ${sizeMB} MB`);
    console.log("");
    console.log("Markdown snippet for content/cpp-ide.md:");
    console.log(
        `<a href="${url}" download="${ASSET_NAME}" ` +
            `style="display:inline-block;padding:14px 32px;` +
            `background:#007ACC;color:#fff;border-radius:8px;text-decoration:none;` +
            `font-weight:600;font-size:1.1em;margin:16px 0;">Download APK</a>`,
    );

    // Persist the URL so a follow-up script (or the CI step that
    // updates content/cpp-ide.md) can read it without parsing stdout.
    const repoRoot = path.resolve(__dirname, "..", "..");
    const outFile = path.join(repoRoot, ".apk-url.txt");
    fs.writeFileSync(outFile, url + "\n");
    console.log(`\nWrote ${outFile}`);
}

try {
    main();
} catch (err) {
    console.error("\n✗ Publish failed:", err.message ?? err);
    process.exit(1);
}
