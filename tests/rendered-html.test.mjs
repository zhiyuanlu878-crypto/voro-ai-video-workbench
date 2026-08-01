import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const prototypeUrl = new URL("../public/prototype.html", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("serves the VORO workbench shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /VORO｜AI 视频制作工作台/);
  assert.match(html, /<iframe[^>]+src="\/prototype\.html"/i);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("starts from an empty project flow instead of a completed sample", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /创建空白项目/);
  assert.match(html, /把客户需求完整粘贴到这里/);
  assert.match(html, /retireLegacyCompletedDemo\(\);if\(!location\.hash\)history\.replaceState\(null,'','#projects'\)/);
  assert.doesNotMatch(html, /if\(demoRequested\)loadCustomerDemo\(false\)/);
  assert.match(html, /function stageGate\(p,page\)/);
});

test("contains the complete click-driven naval production chain", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  for (const action of [
    "save-requirements",
    "ai-analyze",
    "ai-plan",
    "lock-plan",
    "ai-generate-structure",
    "confirm-storyboard",
    "batch-generate-keyframes",
    "batch-generate-videos",
    "adopt-lock-all",
    "auto-sequence",
    "batch-generate-tracks",
    "save-timeline",
    "render-review",
    "run-qc",
    "submit-review",
    "approve-current-review",
    "export-package",
  ]) assert.match(html, new RegExp(`data-action=["']${action}["']|a==='${action}'`));
  assert.match(html, /p\.scenes\.length===6&&shots\.length===15/);
  assert.match(html, /Math\.abs\(total-90\)>\.2/);
  assert.match(html, /finalMedia:null/);
});

test("ships every media file used by the live demo", async () => {
  const required = [
    "public/production/output/naval-equipment-90s-final-subtitled-v7.mp4",
    "public/production/output/naval-equipment-90s-final.srt",
    "public/media/audio/narration-documentary-zh-v7-final.wav",
    "public/media/audio/music-ocean-documentary.wav",
    "public/media/audio/sfx-cannon-fire.wav",
  ];
  await Promise.all(required.map((path) => access(new URL(path, root))));
});

test("the embedded application script is syntactically valid", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  const match = html.match(/<script id="voroApp">([\s\S]*?)<\/script>/);
  assert.ok(match, "voroApp script is present");
  assert.doesNotThrow(() => new Function(match[1]));
});

test("keeps desktop and mobile workbench pages scrollable", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /\.main\{height:100%;min-width:0;min-height:0;overflow:hidden/);
  assert.match(html, /\.content\{flex:1 1 auto;min-height:0;overflow-y:auto/);
  assert.match(html, /\.nav\{[^}]*overflow-y:auto[^}]*min-height:0/);
  assert.match(html, /@media\(max-width:850px\)[\s\S]*?\.content\{min-height:0;overflow:visible/);
});
