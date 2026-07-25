"use client";

import { useMemo, useState } from "react";

type Shot = {
  id: string;
  title: string;
  group: string;
  duration: string;
  frame: string;
  video?: string;
  model?: string;
  note: string;
};

const shots: Shot[] = [
  { id: "S01", title: "远洋环境建立", group: "海洋环境", duration: "6秒", frame: "/media/frames/S01-ocean-establishing.png", video: "/media/clips/S01-svd.mp4", model: "Stable Video Diffusion", note: "晴朗远洋、低海况，舰队由地平线进入画面。" },
  { id: "S02", title: "风暴海况航行", group: "海洋环境", duration: "5秒", frame: "/media/frames/S02-storm-sea-transit.png", video: "/media/clips/S02-kling.mp4", model: "可灵", note: "低机位跟随，突出舰体尺度、巨浪和飞沫。" },
  { id: "S03", title: "主力驱逐舰巡航", group: "主力型号", duration: "5秒", frame: "/media/frames/S03-type055-cruise.png", video: "/media/clips/S03-kling.mp4", model: "可灵", note: "高速巡航，展示舰艏、上层建筑和真实尾流。" },
  { id: "S04–S06", title: "舰型与三维装备展示", group: "主力型号 / 装备", duration: "15秒", frame: "/media/frames/S06-3d-equipment-showcase.png", note: "计划合并052D、国外主力舰型与三维装备环绕展示。" },
  { id: "S07–S09", title: "舰炮、雷达与舰载机", group: "装备动作", duration: "15秒", frame: "/media/frames/S09-carrier-takeoff.png", video: "/media/clips/S07-S09-kling-15s.mp4", model: "可灵 Video 3.0", note: "三段自定义分镜：舰炮开火、风雨甲板、舰载机滑行。" },
  { id: "S10–S12", title: "起飞、编队与收束", group: "编队对抗", duration: "15秒", frame: "/media/frames/S11-formation-exercise.png", note: "待生成：舰载机掠过编队、双编队机动和远景收束。" },
];

const steps = [
  ["01", "项目需求"], ["02", "创作方案"], ["03", "内容结构"],
  ["04", "场景设计"], ["05", "分镜规划"], ["06", "视觉设定"],
  ["07", "关键帧"], ["08", "视频生成"], ["09", "合成输出"],
];

const stepCopy = [
  ["项目需求", "明确展示目标、受众、时长和交付规格。", ["水面舰船装备效果", "国内外主力列装型号", "多海况与多天气", "写实视觉与16:9输出"]],
  ["创作方案", "采用“环境—舰型—装备—舰载机—编队”的递进结构。", ["纪录片式表达", "低机位突出体量", "空中镜头说明编队", "关键动作独立生成"]],
  ["内容结构", "将内容拆成可单独调整的镜头组，避免整片重做。", ["S01–S03 环境与巡航", "S04–S06 舰型与装备", "S07–S09 动作与舰载机", "S10–S12 编队收束"]],
  ["场景设计", "统一海况、天气、时间与光线，保证跨镜头连续。", ["晴朗远洋", "阴天高海况", "风雨甲板", "转晴编队远景"]],
  ["分镜规划", "每组以5秒或15秒为单位，独立确认后进入生成。", ["远景建立空间", "跟拍表现航行", "环绕展示结构", "特写呈现装备动作"]],
  ["视觉设定", "锁定舰体轮廓、钢铁材质、海水动力和光照标准。", ["舰型外观一致", "装备位置稳定", "真实尾流与飞沫", "不出现舷号与标识"]],
  ["关键帧", "12张关键帧已归档，生成时按镜头引用。", ["S01–S12 已就绪", "构图已确认", "天气已匹配", "可按组上传"]],
  ["视频生成", "已接入4个真实视频文件，未生成镜头明确保留待办状态。", ["S01 已完成", "S02 已完成", "S03 已完成", "S07–S09 已完成"]],
  ["合成输出", "当前可预览已完成片段，并按顺序检查最终拼接。", ["共31秒真实片段", "4个视频文件", "2组待生成", "支持逐片审核"]],
];

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [stage, setStage] = useState(7);
  const [selected, setSelected] = useState(0);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "todo">("all");

  const visible = useMemo(() => shots.filter(s => filter === "all" || (filter === "done" ? s.video : !s.video)), [filter]);
  const done = shots.filter(s => s.video);
  const totalSeconds = 31;
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2200); };

  if (!opened) {
    return (
      <main className="hub">
        <header className="hubTop"><div className="logo">V<span>O</span>RO <small>AI视频制作工作台</small></div><div className="plainTag">无需工作台账号 · 模型可替换</div></header>
        <section className="hubBody">
          <div className="intro"><div><span>项目中心</span><h1>选择项目，继续制作</h1><p>从项目进入完整流程，每一步都有独立产物、状态和调整入口。</p></div><button onClick={() => notify("原型暂不创建新项目")}>＋ 新建项目</button></div>
          <button className="project" onClick={() => setOpened(true)}>
            <div className="projectVisual"><img src="/media/frames/S03-type055-cruise.png" alt="" /><div className="shade"/><b>进行中</b><div><small>真实制作项目</small><h2>海洋舰船装备效果展示</h2></div></div>
            <div className="projectInfo"><div><strong>海洋舰船装备效果展示</strong><span>装备演示 · 16:9 · 写实风格</span></div><em>进入项目 →</em></div>
            <div className="progress"><span><i style={{width:"78%"}}/></span><b>已生成 4 个视频文件 · 31秒</b></div>
          </button>
          <div className="principles"><span>工作流能力</span><b>分步确认</b><b>关键帧锁定</b><b>模型可替换</b><b>失败局部重做</b><b>真实结果回放</b></div>
        </section>
        {toast && <div className="toast">{toast}</div>}
      </main>
    );
  }

  const copy = stepCopy[stage];
  const activeShot = shots[selected] ?? shots[0];

  return (
    <main className="shell">
      <header className="top">
        <button className="back" onClick={() => setOpened(false)}>← 项目中心</button>
        <div><strong>海洋舰船装备效果展示</strong><span>自动保存 · 当前真实素材 31秒</span></div>
        <button onClick={() => setStage(8)}>查看结果</button>
      </header>
      <div className="layout">
        <aside className="steps">
          <div className="stepTitle"><span>制作流程</span><b>9个可控步骤</b></div>
          {steps.map((item, i) => <button key={item[0]} className={stage === i ? "active" : ""} onClick={() => setStage(i)}><i>{item[0]}</i><span>{item[1]}<small>{i < 7 ? "已确认" : i === 7 ? "进行中" : "可预览"}</small></span></button>)}
        </aside>
        <section className="work">
          <div className="workHead"><div><span>步骤 {String(stage + 1).padStart(2, "0")}</span><h1>{copy[0]}</h1><p>{copy[1]}</p></div><button onClick={() => notify(`${copy[0]}已锁定`)}>锁定本步骤</button></div>

          {stage !== 7 && stage !== 8 && (
            <div className="featureGrid">{copy[2].map((x, i) => <button key={x} onClick={() => notify(`已打开：${x}`)}><span>0{i+1}</span><strong>{x}</strong><p>点击查看、调整并保存本模块配置。</p><small>查看与编辑 →</small></button>)}</div>
          )}

          {stage === 7 && (
            <>
              <div className="filters"><button className={filter==="all"?"on":""} onClick={()=>setFilter("all")}>全部 6</button><button className={filter==="done"?"on":""} onClick={()=>setFilter("done")}>已生成 4</button><button className={filter==="todo"?"on":""} onClick={()=>setFilter("todo")}>待生成 2</button></div>
              <div className="shotGrid">{visible.map(s => {
                const idx = shots.indexOf(s);
                return <button className={`shot ${selected===idx?"selected":""}`} key={s.id} onClick={()=>setSelected(idx)}>
                  <div className="thumb"><img src={s.frame} alt={s.title}/>{s.video ? <span className="play">▶</span> : <span className="pending">待生成</span>}</div>
                  <div className="shotText"><span>{s.id} · {s.duration}</span><strong>{s.title}</strong><small>{s.group}</small></div>
                </button>;
              })}</div>
            </>
          )}

          {stage === 8 && (
            <div className="result">
              <div className="resultHero">
                <video key={activeShot.video} controls poster={activeShot.frame} src={activeShot.video || undefined}/>
                {!activeShot.video && <div className="notReady"><b>{activeShot.id} 尚未生成</b><span>完成后替换对应视频文件即可进入时间线。</span></div>}
              </div>
              <div className="resultList">{done.map((s, i)=><button key={s.id} className={selected===shots.indexOf(s)?"active":""} onClick={()=>setSelected(shots.indexOf(s))}><img src={s.frame} alt=""/><span><b>{s.id} · {s.title}</b><small>{s.duration} · {s.model}</small></span><em>▶</em></button>)}</div>
              <div className="stats"><div><b>{totalSeconds}s</b><span>真实视频时长</span></div><div><b>4</b><span>已生成文件</span></div><div><b>2</b><span>待生成镜头组</span></div><div><b>16:9</b><span>输出比例</span></div></div>
            </div>
          )}

          <footer className="workFoot"><button disabled={stage===0} onClick={()=>setStage(Math.max(0,stage-1))}>← 上一步</button><span>所有结果按项目独立保存，修改只影响对应步骤。</span><button className="primary" onClick={()=>setStage(Math.min(8,stage+1))}>{stage===8?"完成项目检查":"确认并进入下一步 →"}</button></footer>
        </section>
        <aside className="inspect">
          <div className="inspectHead"><span>当前产物</span><strong>{stage===7||stage===8 ? activeShot.id : copy[0]}</strong></div>
          {stage===7||stage===8 ? <>
            <img className="inspectImg" src={activeShot.frame} alt=""/>
            <div className={`status ${activeShot.video?"ok":"wait"}`}>{activeShot.video?"✓ 视频已生成":"○ 等待生成"}</div>
            <dl><dt>镜头组</dt><dd>{activeShot.title}</dd><dt>时长</dt><dd>{activeShot.duration}</dd><dt>生成服务</dt><dd>{activeShot.model || "待选择"}</dd><dt>说明</dt><dd>{activeShot.note}</dd></dl>
            {activeShot.video && <button className="wideBtn" onClick={()=>setStage(8)}>预览真实视频</button>}
          </> : <>
            <div className="summary"><b>{copy[2].length}</b><span>个可编辑模块</span></div>
            <div className="checks">{copy[2].map(x=><label key={x}><input type="checkbox" defaultChecked/><span>{x}</span></label>)}</div>
            <div className="model"><span>应用接入原则</span><strong>按步骤自由配置</strong><p>工作台不绑定固定模型；文本、图片、视频和声音服务均可替换。</p></div>
          </>}
        </aside>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
