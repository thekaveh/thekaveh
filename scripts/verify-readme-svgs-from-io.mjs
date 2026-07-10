#!/usr/bin/env node
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const pixelmatchModule = require("pixelmatch");
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const ioRepo = path.resolve(process.env.IO_REPO || path.join(repoRoot, "..", "thekaveh.github.io"));
const ioIndex = path.join(ioRepo, "index.html");
const readmePath = path.join(repoRoot, "README.md");
const viewportWidth = Number(process.env.PROFILE_RENDER_WIDTH || 1180);

const sections = [
  { id: "hero", selector: "#hero", file: "assets/profile-hero.svg", lightFile: "assets/profile-hero-light.svg", href: "https://thekaveh.github.io/#hero" },
  { id: "projects", selector: "#projects", file: "assets/section-projects.svg", lightFile: "assets/section-projects-light.svg", href: "https://thekaveh.github.io/#projects" },
  { id: "skills", selector: "#skills", file: "assets/section-skills.svg", lightFile: "assets/section-skills-light.svg", href: "https://thekaveh.github.io/#skills" },
  { id: "connect", selector: "#connect", file: "assets/section-connect.svg", lightFile: "assets/section-connect-light.svg", href: "https://thekaveh.github.io/#connect" },
];

function fail(message) {
  throw new Error(message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readPng(buffer, label) {
  try {
    return PNG.sync.read(buffer);
  } catch (error) {
    fail(`Could not decode ${label} as PNG: ${error.message}`);
  }
}

function extractEmbeddedPng(svgText, label) {
  const match = svgText.match(/<image\b[^>]*\bhref="data:image\/png;base64,([^"]+)"/);
  if (!match) {
    fail(`${label} does not contain a raster-backed SVG image href`);
  }
  return Buffer.from(match[1], "base64");
}

function extractSvgSize(svgText, label) {
  const width = svgText.match(/\bwidth="(\d+)"/)?.[1];
  const height = svgText.match(/\bheight="(\d+)"/)?.[1];
  if (!width || !height) {
    fail(`${label} is missing explicit width/height`);
  }
  return { width: Number(width), height: Number(height) };
}

function verifyNoForbiddenSvg(svgText, label) {
  const forbidden = ["<script", "<foreignObject", "<iframe"];
  const hits = forbidden.filter((token) => svgText.includes(token));
  if (hits.length) {
    fail(`${label} contains forbidden SVG tag(s): ${hits.join(", ")}`);
  }
}

function comparePngs(expectedBuffer, actualBuffer, label) {
  const expected = readPng(expectedBuffer, `${label} .io capture`);
  const actual = readPng(actualBuffer, `${label} embedded SVG PNG`);

  if (expected.width !== actual.width || expected.height !== actual.height) {
    fail(`${label} dimensions differ: .io=${expected.width}x${expected.height}, svg=${actual.width}x${actual.height}`);
  }

  const diff = new PNG({ width: expected.width, height: expected.height });
  const mismatches = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    expected.width,
    expected.height,
    { threshold: 0, includeAA: true },
  );

  if (mismatches !== 0) {
    fail(`${label} differs by ${mismatches} pixel(s)`);
  }

  return { width: expected.width, height: expected.height, mismatches };
}

function verifyReadmeLinks() {
  const readme = fs.readFileSync(readmePath, "utf8");
  for (const section of sections) {
    const href = escapeRegExp(section.href);
    const file = escapeRegExp(`./${section.file}`);
    const lightFile = escapeRegExp(`./${section.lightFile}`);
    const sectionPattern = new RegExp(`<a href="${href}">[\\s\\S]*?<source[^>]+srcset="${lightFile}"[\\s\\S]*?<img[^>]+src="${file}"`, "m");
    if (!sectionPattern.test(readme)) {
      fail(`README wrapper for ${section.id} does not link ${section.file} to ${section.href} with the matching light asset`);
    }
  }

  if (!readme.includes("<strong>Projects:</strong>")) {
    fail("README is missing the centered Projects: row");
  }
  if (readme.includes("Open ·")) {
    fail("README still contains the old Open · label");
  }
  if (!readme.includes("<strong>Reach out:</strong>")) {
    fail("README is missing the centered Reach out: row");
  }
  if (readme.includes("Reach out ·")) {
    fail("README still contains the old Reach out · label");
  }
}

async function main() {
  if (!fs.existsSync(ioIndex)) {
    fail(`Could not find .io source at ${ioIndex}`);
  }

  verifyReadmeLinks();

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

  const report = [];
  for (const section of sections) {
    const locator = page.locator(section.selector);
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const capture = await locator.screenshot({ type: "png", animations: "disabled", timeout: 120000 });

    for (const file of [section.file, section.lightFile]) {
      const svgPath = path.join(repoRoot, file);
      const svgText = fs.readFileSync(svgPath, "utf8");
      verifyNoForbiddenSvg(svgText, file);

      const svgSize = extractSvgSize(svgText, file);
      const embedded = extractEmbeddedPng(svgText, file);
      const compared = comparePngs(capture, embedded, file);

      if (svgSize.width !== compared.width || svgSize.height !== compared.height) {
        fail(`${file} SVG dimensions ${svgSize.width}x${svgSize.height} do not match embedded PNG ${compared.width}x${compared.height}`);
      }

      report.push({
        section: section.id,
        file,
        width: compared.width,
        height: compared.height,
        mismatches: compared.mismatches,
      });
    }
  }

  await browser.close();

  if (failures.length) {
    fail(`Playwright request failures while capturing .io: ${failures.join("; ")}`);
  }

  console.log(JSON.stringify({
    verifiedAgainst: ioIndex,
    viewport: { width: viewportWidth, deviceScaleFactor: 1 },
    sections: report,
    result: "pixel-perfect",
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
