import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
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

test("serves the VORO workbench shell with clean metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /VORO · AI 视频制作工作台/);
  assert.match(html, /<iframe[^>]+src="\/prototype\.html"/i);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|瑙嗛|鍒朵綔/);
});

test("starts from a blank project and preserves the click-driven production chain", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /创建空白项目/);
  assert.match(html, /把客户需求完整粘贴到这里/);
  assert.match(html, /retireLegacyCompletedDemo\(\);if\(!location\.hash\)history\.replaceState\(null,'','#projects'\)/);
  for (const action of [
    "save-requirements",
    "ai-analyze",
    "accept-requirements",
    "confirm-requirement-adjustments",
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
  ]) assert.match(html, new RegExp(`data-action=["']${action}["']|a==='${action}'`));
});

test("discloses replay versus live generation and never labels simulation as connected", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /演示回放模式：使用已归档的确定性成果/);
  assert.match(html, /实时运行模式：每次生成会调用已配置服务/);
  assert.match(html, /simulation:'演示模拟'/);
  assert.match(html, /mode==='live'&&!p\?\.generation\?\.providerReady/);
  assert.match(html, /m\.connectionType==='simulation'\?'simulation'/);
  assert.doesNotMatch(html, /m\.connectionType==='simulation'\|\|m\.endpoint\?'connected'/);
});

test("implements requirement traceability and immutable stage versions", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /原始需求覆盖与范围确认/);
  assert.match(html, /function requirementGate\(p\)/);
  assert.match(html, /function createStageVersion\(p,stage/);
  assert.match(html, /function cloneLockedVersionAsDraft\(p,stage/);
  assert.match(html, /需求范围尚未确认/);
  assert.match(html, /基于分镜V/);
});

test("uses a shot list, detail inspector, editable prompts and persistent queue", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /function shotsPageV8\(\)/);
  assert.match(html, /class="shot-workbench"/);
  assert.match(html, /data-shot-prompt/);
  assert.match(html, /function shotJobQueueHtml\(p\)/);
  assert.match(html, /基于锁定版创建新候选/);
  assert.match(html, /shots:shotsPageV8/);
});

test("shows evidence-backed QC and blocks unsupported external delivery", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /雪天镜头缺失/);
  assert.match(html, /商用授权材料未归档/);
  assert.match(html, /问题必须包含时间码、证据、置信度、负责人和处理状态/);
  assert.match(html, /外部交付门禁/);
  assert.match(html, /下载V8内部审片包/);
  assert.match(html, /assignee:'client-reviewer'/);
  assert.doesNotMatch(html, /qcSummary=\{passed:32,warningsFixed:3,blocking:0\}/);
});

test("ships the V8 master, web playback copy, subtitles, reports and real review package", async () => {
  const required = [
    "public/production/output/naval-equipment-90s-final-v8.mp4",
    "public/production/output/naval-equipment-90s-final-v8-web.mp4",
    "public/production/output/naval-equipment-90s-final-v8.srt",
    "public/production/output/requirement-coverage-v8.json",
    "public/production/output/qc-report-v8.json",
    "public/production/output/rights-manifest-v8.json",
    "public/production/output/delivery-manifest-v8.json",
    "public/production/output/voro-naval-delivery-v8.zip",
    "public/media/audio/narration-documentary-zh-v7-final.wav",
    "public/media/audio/music-ocean-documentary.wav",
  ];
  await Promise.all(required.map((path) => access(new URL(path, root))));
  const web = await stat(new URL("public/production/output/naval-equipment-90s-final-v8-web.mp4", root));
  const master = await stat(new URL("public/production/output/naval-equipment-90s-final-v8.mp4", root));
  assert.ok(web.size < master.size, "web playback copy is smaller than the master");
  for (const name of ["requirement-coverage-v8.json", "qc-report-v8.json", "rights-manifest-v8.json", "delivery-manifest-v8.json"]) {
    JSON.parse(await readFile(new URL(`public/production/output/${name}`, root), "utf8"));
  }
});

test("the embedded application script is syntactically valid", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  const match = html.match(/<script id="voroApp">([\s\S]*?)<\/script>/);
  assert.ok(match, "voroApp script is present");
  assert.doesNotThrow(() => new Function(match[1]));
});

test("keeps desktop and mobile workbench pages scrollable and readable", async () => {
  const html = await readFile(prototypeUrl, "utf8");
  assert.match(html, /\.main\{height:100%;min-width:0;min-height:0;overflow:hidden/);
  assert.match(html, /\.content\{flex:1 1 auto;min-height:0;overflow-y:auto/);
  assert.match(html, /\.nav\{[^}]*overflow-y:auto[^}]*min-height:0/);
  assert.match(html, /@media\(max-width:850px\)[\s\S]*?\.content\{min-height:0;overflow:visible/);
  assert.match(html, /body\.presentation-mode/);
});
