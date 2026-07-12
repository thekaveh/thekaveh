#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const ioRepo = path.resolve(process.env.IO_REPO || path.join(repoRoot, "..", "thekaveh.github.io"));
const ioIndex = path.join(ioRepo, "index.html");
const outDir = path.resolve(process.env.OUT_DIR || path.join(repoRoot, "assets"));
const viewportWidth = Number(process.env.PROFILE_RENDER_WIDTH || 1180);
const targetBase = process.env.PROFILE_TARGET_BASE || "https://thekaveh.github.io";

const sections = [
  { id: "hero", selector: "#hero", file: "profile-hero.svg", lightFile: "profile-hero-light.svg", href: `${targetBase}/#hero` },
  { id: "projects", selector: "#projects", file: "section-projects.svg", lightFile: "section-projects-light.svg", href: `${targetBase}/#projects` },
  { id: "skills", selector: "#skills", file: "section-skills.svg", lightFile: "section-skills-light.svg", href: `${targetBase}/#skills` },
  { id: "connect", selector: "#connect", file: "section-connect.svg", lightFile: "section-connect-light.svg", href: `${targetBase}/#connect` },
];

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function escapeXml(value) {
  return String(value).replace(/[<>&"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "\"": "&quot;",
  })[char]);
}

function pngDimensions(buffer) {
  if (buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error("Expected a PNG screenshot buffer");
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function loadPlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    console.error("Could not import Playwright. Install it or run with NODE_PATH pointing at a Playwright install.");
    console.error(error?.message || error);
    process.exit(1);
  }
}

function buildSvg({ width, height, png, section, sourceHash }) {
  const title = `Kaveh profile ${section.id} section`;
  const desc = [
    `Generated from ${ioIndex}`,
    `source sha256:${sourceHash}`,
    `target:${section.href}`,
    "The visual frame is captured from the rendered .io section to keep README parity exact.",
  ].join(". ");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(desc)}</desc>
  <image href="data:image/png;base64,${png.toString("base64")}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMinYMin meet"/>
</svg>
`;
}

async function main() {
  if (!fs.existsSync(ioIndex)) {
    throw new Error(`Could not find .io source at ${ioIndex}`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: viewportWidth, height: 1800 },
    deviceScaleFactor: 1,
  });

  const failures = [];
  page.on("requestfailed", (request) => {
    failures.push(`${request.url()} :: ${request.failure()?.errorText || "request failed"}`);
  });

  const url = pathToFileURL(ioIndex);
  url.searchParams.set("profile-render", "svg");
  await page.goto(url.href, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll("#skills .cat").length === 7);
  await page.waitForTimeout(250);

  const source = fs.readFileSync(ioIndex);
  const sourceHash = sha256(source);
  const extracted = await page.evaluate(() => {
    const legacyTagline = [...document.querySelectorAll("#hero .tagline span")]
      .map((el) => el.textContent.trim())
      .filter(Boolean);
    const heroStatus = [...document.querySelectorAll("#hero .status-item")].map((item) => ({
      key: item.getAttribute("data-status"),
      label: item.querySelector(".status-key")?.textContent.trim() || "",
      value: item.querySelector(".status-value")?.textContent.trim() || "",
    }));

    return {
      title: document.title,
      tagline: legacyTagline.length ? legacyTagline : heroStatus.map((item) => item.value).filter(Boolean),
      heroStatus,
      identity: document.querySelector("#hero pre.ts")?.innerText || "",
      mission: document.querySelector("#hero .mission")?.innerText || "",
      projects: [...document.querySelectorAll("#projects .card h3")].map((el) => el.textContent.trim()),
      skillCategories: [...document.querySelectorAll("#skills .cat .head h3")].map((el) => el.textContent.trim()),
      skillCounts: [...document.querySelectorAll("#skills .cat .head")].map((head) => ({
        title: head.querySelector("h3")?.textContent.trim(),
        count: head.querySelector(".count")?.textContent.trim(),
        prompt: head.querySelector(".ps")?.textContent.trim(),
      })),
      connect: [...document.querySelectorAll("#connect .service .label")].map((el) => el.textContent.trim()),
    };
  });

  const manifest = {
    generatedFrom: ioIndex,
    generatedFromSha256: sourceHash,
    generatedAt: new Date().toISOString(),
    viewport: { width: viewportWidth, deviceScaleFactor: 1 },
    note: "The light SVG files intentionally mirror the .io dark render until the .io source grows a first-class light theme.",
    failures,
    extracted,
    sections: [],
  };

  for (const section of sections) {
    const locator = page.locator(section.selector);
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const box = await locator.boundingBox();
    if (!box) {
      throw new Error(`Could not locate ${section.selector}`);
    }

    const png = await locator.screenshot({ type: "png", animations: "disabled", timeout: 120000 });
    const { width, height } = pngDimensions(png);
    const svg = buildSvg({ width, height, png, section, sourceHash });

    fs.writeFileSync(path.join(outDir, section.file), svg);
    fs.writeFileSync(path.join(outDir, section.lightFile), svg);

    manifest.sections.push({
      id: section.id,
      selector: section.selector,
      href: section.href,
      file: path.relative(repoRoot, path.join(outDir, section.file)),
      lightFile: path.relative(repoRoot, path.join(outDir, section.lightFile)),
      width,
      height,
      pngSha256: sha256(png),
    });
  }

  await browser.close();

  fs.writeFileSync(
    path.join(outDir, "generated-from-io.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );

  console.log(JSON.stringify({
    generatedFrom: ioIndex,
    generatedFromSha256: sourceHash,
    outDir,
    sections: manifest.sections,
    failures,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
