"use client";

import { useState } from "react";

const stages = [
  ["01", "需求", "已完成"],
  ["02", "创作方案", "已完成"],
  ["03", "内容结构", "已完成"],
  ["04", "场景", "已完成"],
  ["05", "分镜", "已完成"],
  ["06", "视觉设定", "已完成"],
  ["07", "关键帧", "已完成"],
  ["08", "视频片段", "已完成"],
  ["09", "合成", "已完成"],
];

const providers = [
  { name: "GPT-5.6 Sol", app: "需求结构化", detail: "长文本理解、约束提取与结构化项目简报" },
  { name: "GPT-5.6 Sol", app: "创意策划", detail: "叙事策略、视觉方向与制作方案推演" },
  { name: "GPT-5.6 Sol", app: "内容编排", detail: "章节结构、时长分配与内容完整性检查" },
  { name: "GPT-5.6 Sol + GPT Image 2", app: "场景设计", detail: "环境描述、场景预演与视觉参考生成" },
  { name: "GPT-5.6 Sol", app: "分镜规划", detail: "镜头拆解、景别、机位、运镜与连续性" },
  { name: "GPT Image 2", app: "视觉设定", detail: "型号参考、材质、天气与效果概念图" },
  { name: "GPT Image 2", app: "关键帧生成", detail: "高写实静态帧、构图确认与局部调整" },
  { name: "Runway Gen-4.5", app: "视频片段生成", detail: "文本或关键帧驱动的视频镜头生成" },
  { name: "ElevenLabs + FFmpeg", app: "声音与合成", detail: "环境音效生成、分轨混音与最终成片" },
];

const shots = [
  { id: "01", title: "远洋航行", desc: "主力水面舰船编队在中等海况下高速航行，展现舰体与尾流", time: "8s", type: "大全景", color: "blue", weather: "晴朗 · 3级浪" },
  { id: "02", title: "舰体展示", desc: "环绕展示舰船三维模型、舰桥、雷达和甲板装备细节", time: "8s", type: "全景", color: "green", weather: "多云 · 2级浪" },
  { id: "03", title: "主炮射击", desc: "舰艏主炮向海面目标射击，呈现炮口火焰、烟尘与舰体反馈", time: "6s", type: "中远景", color: "red", weather: "阴天 · 4级浪" },
  { id: "04", title: "舰载机起飞", desc: "舰载机从甲板完成启动、滑行并起飞，甲板人员保持安全距离", time: "8s", type: "广角", color: "amber", weather: "晴朗 · 2级浪" },
  { id: "05", title: "编队对抗", desc: "两支不同编队在复杂海况下机动对抗，保持真实尺度与空间关系", time: "10s", type: "超远景", color: "violet", weather: "风雨 · 5级浪" },
];

const stageContent = [
  {
    kicker: "步骤 01 · 项目需求",
    title: "定义这支视频要解决什么问题",
    desc: "先锁定目标、受众、时长和必须呈现的内容，后续步骤都从这里继承。",
    sections: [
      { title: "项目目标", text: "重点显示水面舰船装备效果，展示国内外主力列装型号及海洋环境下的真实表现。", tag: "核心需求" },
      { title: "重点内容", text: "航行效果、舰船三维模型、舰炮射击、舰载机启停、编队对抗。", tag: "5 项" },
      { title: "环境范围", text: "不同等级海浪，以及晴、多云、雨、雪等天气变化。", tag: "海洋环境" },
      { title: "输出规格", text: "16:9 横屏，写实视觉，建议总时长 90 秒，4K 母版。", tag: "90 秒" },
    ],
    checklist: ["装备型号与布局尽量准确", "运动、尺度和海况关系真实", "不绑定生成服务", "允许逐步骤人工确认"],
  },
  {
    kicker: "步骤 02 · 创作方案",
    title: "确定视频的表达策略",
    desc: "把需求转成统一的叙事方向、视觉策略和节奏计划。",
    sections: [
      { title: "创作定位", text: "高写实海洋装备视觉演示，兼顾型号展示、技术效果与对抗氛围。", tag: "写实演示" },
      { title: "叙事路径", text: "环境建立 → 单舰展示 → 装备动作 → 舰载机作业 → 编队对抗。", tag: "递进结构" },
      { title: "视觉策略", text: "海面低机位突出体量，空中俯拍说明编队关系，特写呈现装备细节。", tag: "多机位" },
      { title: "真实感策略", text: "锁定型号参考、物理尺度、海浪方向、光照和武器动作连续性。", tag: "强约束" },
    ],
    checklist: ["冷静、专业的整体基调", "避免夸张科幻效果", "关键动作使用多视角", "天气变化服务内容节奏"],
  },
  {
    kicker: "步骤 03 · 内容结构",
    title: "把 90 秒内容组织成清晰章节",
    desc: "每一章节都有目标、时长和交付物，修改时不会牵动整支视频。",
    sections: [
      { title: "01 海洋环境建立", text: "不同海况与天气下的远洋画面，建立真实空间与尺度。", tag: "12 秒" },
      { title: "02 主力型号巡航", text: "国内外主力列装型号依次出现，展示外形与航行姿态。", tag: "22 秒" },
      { title: "03 装备动作演示", text: "三维模型拆解、雷达工作、主炮转向与射击效果。", tag: "20 秒" },
      { title: "04 舰载机作业", text: "启动、甲板滑行、起飞和着舰流程的连续呈现。", tag: "16 秒" },
      { title: "05 编队对抗", text: "不同编队在复杂海况中的机动、协同与对抗收束。", tag: "20 秒" },
    ],
    checklist: ["总时长 90 秒", "五章结构已覆盖全部需求", "章节可独立调整", "结尾保留编队全景"],
  },
  {
    kicker: "步骤 04 · 场景设计",
    title: "建立可复用的海洋场景库",
    desc: "场景负责统一天气、海况、时间和空间，多个镜头可以共享同一场景。",
    sections: [
      { title: "远洋晴天", text: "开阔海域，能见度高，2—3 级浪，适合型号与编队全景。", tag: "场景 A" },
      { title: "阴天高海况", text: "厚云层、冷色天光、4—5 级浪，适合航行体量和舰炮动作。", tag: "场景 B" },
      { title: "风雨对抗海域", text: "阵雨、低能见度、强风浪，适合编队机动和对抗氛围。", tag: "场景 C" },
      { title: "雪天近岸海域", text: "低温、轻雪、灰蓝色海面，用于极端天气能力展示。", tag: "场景 D" },
    ],
    checklist: ["海浪方向连续", "天气与光照匹配", "地平线保持稳定", "场景参数可被镜头覆盖"],
  },
  null,
  {
    kicker: "步骤 06 · 视觉设定",
    title: "锁定型号、材质与效果标准",
    desc: "集中管理所有镜头必须继承的视觉资产，避免舰体和装备在生成时发生漂移。",
    sections: [
      { title: "舰船型号库", text: "按国家、类别和列装状态管理参考图、三维模型及装备布局。", tag: "8 个型号" },
      { title: "海洋环境库", text: "海浪等级、风向、天气、能见度、时间和光照预设。", tag: "12 个预设" },
      { title: "装备效果库", text: "炮口火焰、烟尘、尾流、雷达转动和甲板作业效果标准。", tag: "已定义" },
      { title: "写实标准", text: "金属材质、尺度透视、光照反射、海水交互与运动惯性。", tag: "高写实" },
    ],
    checklist: ["型号参考已锁定", "不改变装备位置", "不混用国家标识", "特效符合环境光"],
  },
  {
    kicker: "步骤 07 · 关键帧",
    title: "先确认静态画面，再生成运动",
    desc: "每个镜头先确定构图、型号、环境和动作起止状态，减少视频反复生成。",
    sections: [
      { title: "远洋航行", text: "舰体比例正确，舰艏劈浪与尾流方向已确认。", tag: "已确认" },
      { title: "三维环绕", text: "模型材质、雷达与甲板装备布局已完成参考校验。", tag: "已确认" },
      { title: "主炮射击", text: "炮口方向、火焰尺度、烟尘和海况光照已确认。", tag: "已确认" },
      { title: "舰载机起飞", text: "甲板站位、飞机尺度、起飞方向和安全区域已确认。", tag: "已确认" },
      { title: "编队对抗", text: "双方编队间距、航向、海况与画面层次已确认。", tag: "已确认" },
    ],
    checklist: ["GPT Image 2 已完成关键帧", "已有参考帧已归档", "每个镜头保留多版本", "选定版本已锁定为视频参考"],
  },
  {
    kicker: "步骤 08 · 视频片段",
    title: "按镜头独立生成和调整",
    desc: "不同镜头可以选用不同服务。工作台只管理统一参数、任务状态和结果版本。",
    sections: [
      { title: "图生视频服务", text: "关键帧驱动的航行、环绕、射击和舰载机动作已生成。", tag: "12 / 12" },
      { title: "三维渲染服务", text: "严格型号和装备结构的模型展示片段已完成。", tag: "已完成" },
      { title: "环境效果服务", text: "海浪、尾流、雨雪、云层和光照效果已完成增强。", tag: "已完成" },
      { title: "质量检查", text: "已检查结构漂移、物理异常、帧间闪烁和镜头衔接。", tag: "已通过" },
    ],
    checklist: ["服务由项目自行配置", "无需注册工作台账号", "失败只重做当前镜头", "结果统一进入版本库"],
  },
  {
    kicker: "步骤 09 · 合成输出",
    title: "把已确认片段组合成完整成片",
    desc: "统一节奏、声音、字幕和色彩，任何问题都可以回到对应步骤修改。",
    sections: [
      { title: "画面时间线", text: "五章、12 个计划镜头，当前等待关键帧和视频片段。", tag: "90 秒" },
      { title: "声音设计", text: "海浪、风雨、引擎、甲板作业和装备动作分轨管理。", tag: "5 条音轨" },
      { title: "字幕与标注", text: "型号、装备名称、环境参数和章节标题使用统一样式。", tag: "待编辑" },
      { title: "输出版本", text: "4K 16:9 母版、1080P 审阅版和无字幕净版。", tag: "3 种规格" },
    ],
    checklist: ["统一色彩与音量", "检查型号标注", "确认对抗镜头连续性", "导出前执行全片检查"],
  },
] as const;

function StageView({ index, onNext, onBack, notify }: { index: number; onNext: () => void; onBack: () => void; notify: (message: string) => void }) {
  const data = stageContent[index];
  if (!data) return null;
  return (
    <>
      <section className="canvas stage-canvas">
        <div className="stage-hero">
          <div>
            <div className="eyebrow"><span>{data.kicker}</span></div>
            <h1>{data.title}</h1>
            <p>{data.desc}</p>
          </div>
          <button className="lock-btn" onClick={() => notify(`${stages[index][1]}已锁定`)}>○ 锁定本步骤</button>
        </div>
        <div className="inherit-bar"><span>上游输入</span><strong>{index === 0 ? "用户原始需求" : stages[index - 1][1]}</strong><i>→</i><span>当前产物</span><strong>{stages[index][1]}方案</strong></div>
        <div className="stage-grid">
          {data.sections.map((item, itemIndex) => (
            <button className="stage-feature" key={item.title} onClick={() => notify(`已打开：${item.title}`)}>
              <div className="feature-top"><span>{String(itemIndex + 1).padStart(2, "0")}</span><em>{item.tag}</em></div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
              <small>点击查看与编辑 →</small>
            </button>
          ))}
        </div>
        {index === 8 && (
          <div className="final-result">
            <div className="final-screen">
              <div className="ocean-lines"><i /><i /><i /></div>
              <div className="final-ship"><i /></div>
              <button onClick={() => notify("正在播放 90 秒审阅版")}>▶</button>
              <span>海洋舰船装备效果演示 · 最终审阅版</span>
            </div>
            <div className="result-stats">
              <div><strong>90s</strong><span>成片时长</span></div>
              <div><strong>12</strong><span>确认镜头</span></div>
              <div><strong>4K</strong><span>母版规格</span></div>
              <div><strong>100%</strong><span>流程完成</span></div>
            </div>
          </div>
        )}
        <div className="stage-bottom">
          <button disabled={index === 0} onClick={onBack}>← 上一步</button>
          <div><span>当前为演示数据</span><small>字段、内容和节点均可按项目调整</small></div>
          <button className="primary" onClick={onNext}>{index === 8 ? "完成项目检查" : `确认并进入${stages[index + 1][1]} →`}</button>
        </div>
      </section>
      <aside className="inspector stage-inspector">
        <div className="inspector-head"><div><span>步骤检查</span><strong>{stages[index][1]}确认清单</strong></div><button>•••</button></div>
        <div className="step-summary"><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{data.title}</strong><small>{data.sections.length} 个可编辑模块</small></div></div>
        <div className="check-list">
          {data.checklist.map((item, i) => <label key={item}><input type="checkbox" defaultChecked={i < 2} /><span>{item}</span></label>)}
        </div>
        <div className="dependency-card"><strong>修改影响</strong><p>本步骤修改后，系统会标记受影响的下游内容，不会自动覆盖已确认版本。</p><button onClick={() => notify("已查看下游影响范围")}>查看影响范围</button></div>
        <div className="provider-card"><span>当前步骤推荐应用</span><strong>{providers[index].name}</strong><p>{providers[index].detail}</p><button onClick={() => notify(`已打开 ${providers[index].name} 接入配置`)}>查看接入配置</button></div>
      </aside>
    </>
  );
}

function ProjectHub({ onOpen }: { onOpen: () => void }) {
  return (
    <main className="project-hub">
      <header className="hub-header">
        <div className="brand"><span className="brand-mark">V</span><span>VORO</span><span className="brand-sub">通用视频制作工作台</span></div>
        <button className="service-center">◇ 生成服务中心 · 5 项可用</button>
      </header>
      <section className="hub-content">
        <div className="hub-intro">
          <div><span className="hub-kicker">项目中心</span><h1>选择一个项目开始制作</h1><p>每个项目独立保存流程、模型配置、素材、版本和最终成片。</p></div>
          <button className="new-project">＋ 新建项目</button>
        </div>
        <div className="project-filters"><button className="active">全部项目 1</button><button>制作中 0</button><button>已完成 1</button><button>模板</button></div>
        <div className="project-grid">
          <button className="project-card featured" onClick={onOpen}>
            <div className="project-cover">
              <span className="complete-pill">✓ 已完整跑通</span>
              <div className="cover-sea"><i /><i /><i /></div>
              <div className="cover-ship"><i /></div>
              <div className="cover-title"><span>示范项目</span><strong>海洋舰船装备效果演示</strong></div>
            </div>
            <div className="project-info">
              <div><strong>海洋舰船装备效果演示</strong><span>装备演示 · 90 秒 · 16:9 · 4K</span></div>
              <span className="open-arrow">进入项目 →</span>
            </div>
            <div className="project-progress"><span><i /></span><strong>9 / 9 步骤已完成</strong></div>
          </button>
          <button className="empty-project">
            <span>＋</span><strong>创建空白项目</strong><small>选择模板或自定义制作流程</small>
          </button>
        </div>
        <div className="model-strip">
          <span>该示范项目使用的应用编排</span>
          {["GPT-5.6 Sol", "GPT Image 2", "Runway Gen-4.5", "ElevenLabs", "FFmpeg"].map(name => <b key={name}>{name}</b>)}
          <em>均可替换</em>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  const [inProject, setInProject] = useState(false);
  const [activeStage, setActiveStage] = useState(4);
  const [selectedShot, setSelectedShot] = useState(2);
  const [locked, setLocked] = useState(false);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"board" | "timeline">("board");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  if (!inProject) return <ProjectHub onOpen={() => setInProject(true)} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">V</span>
          <span>VORO</span>
          <span className="brand-sub">通用视频制作工作台</span>
        </div>
        <div className="project-name">
          <button aria-label="返回项目" onClick={() => setInProject(false)}>‹</button>
          <div>
            <strong>海洋舰船装备效果演示</strong>
            <span>装备演示 · 40 秒 · 16:9</span>
          </div>
          <span className="saved">✓ 已保存</span>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={() => notify("已打开版本记录")}>↶ 版本记录</button>
          <button className="provider" onClick={() => notify("已打开项目生成服务编排")}>◇ 生成服务 · 5 项已配置</button>
          <button className="export" onClick={() => notify("项目已进入导出准备")}>导出项目</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="stage-panel">
          <div className="stage-heading">
            <span>制作流程</span>
            <button aria-label="流程设置">•••</button>
          </div>
          <div className="progress-copy">
            <strong>项目进度</strong><span>100%</span>
            <div className="progress"><i /></div>
          </div>
          <nav className="stage-list">
            {stages.map((stage, index) => (
              <button
                key={stage[1]}
                className={`${activeStage === index ? "active" : ""} done`}
                onClick={() => setActiveStage(index)}
              >
                <span className="stage-num">✓</span>
                <span className="stage-title">{stage[1]}<small>{stage[2]}</small></span>
                {(index < 2 || (index === 4 && locked)) && <span className="lock">⌁</span>}
              </button>
            ))}
          </nav>
          <button className="add-step" onClick={() => notify("可在正式版本中添加自定义节点")}>＋ 添加制作步骤</button>
          <div className="flow-tip">
            <span>✦</span>
            <p><strong>流程建议</strong>确认分镜后再生成关键帧，可以显著减少重复生成。</p>
          </div>
        </aside>

        {activeStage === 4 ? (
        <>
        <section className="canvas">
          <div className="canvas-head">
            <div>
              <div className="eyebrow"><span>场景 02</span><b>／</b> 分镜设计</div>
              <h1>把内容拆解为可控制作单元</h1>
              <p>界面不绑定任何模型。可按项目接入不同的图像、视频与声音生成服务。</p>
            </div>
            <div className="canvas-actions">
              <button className="ghost" onClick={() => notify("已完成镜头连贯性检查")}>✦ 智能检查</button>
              <button className={`lock-btn ${locked ? "is-locked" : ""}`} onClick={() => { setLocked(!locked); notify(!locked ? "分镜已锁定" : "分镜已解锁"); }}>
                {locked ? "● 已锁定" : "○ 锁定分镜"}
              </button>
              <button className="next-stage" onClick={() => { setActiveStage(5); notify("已进入：视觉设定"); }}>进入视觉设定 →</button>
            </div>
          </div>

          <div className="scene-strip">
            <button className="scene-card"><span className="scene-index">01</span><div><strong>海洋环境与航行</strong><small>2 个镜头 · 16 秒</small></div><em>✓</em></button>
            <button className="scene-card selected"><span className="scene-index">02</span><div><strong>装备与舰载机展示</strong><small>3 个镜头 · 22 秒</small></div><em>编辑中</em></button>
            <button className="scene-card"><span className="scene-index">03</span><div><strong>编队机动与对抗</strong><small>2 个镜头 · 18 秒</small></div><em>待编辑</em></button>
            <button className="new-scene" onClick={() => notify("已创建一个空白场景")}>＋ 新场景</button>
          </div>

          <div className="view-toolbar">
            <div className="segmented">
              <button className={view === "board" ? "active" : ""} onClick={() => setView("board")}>▦ 分镜板</button>
              <button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")}>☷ 时间线</button>
            </div>
            <div className="shot-meta"><span>5 个镜头</span><span>总时长 40 秒</span><button onClick={() => notify("镜头顺序已自动优化")}>↕ 自动排序</button></div>
          </div>

          <div className={`shot-board ${view}`}>
            {shots.map((shot, index) => (
              <button key={shot.id} className={`shot-card ${selectedShot === index ? "selected" : ""}`} onClick={() => setSelectedShot(index)}>
                <div className={`shot-visual ${shot.color}`}>
                  <span className="shot-label">SHOT {shot.id}</span>
                  <div className="visual-scene">
                    <i className="moon" /><i className="rain r1" /><i className="rain r2" /><i className="rain r3" />
                    <i className="subject" /><i className="ground" />
                  </div>
                  {selectedShot === index && <span className="selected-check">✓</span>}
                </div>
                <div className="shot-copy">
                  <div><strong>{shot.title}</strong><span>{shot.time}</span></div>
                  <p>{shot.desc}</p>
                  <div className="tags"><span>{shot.type}</span><span>{shot.weather}</span></div>
                </div>
              </button>
            ))}
            <button className="add-shot" onClick={() => notify("已添加一个空白镜头")}>
              <span>＋</span><strong>添加镜头</strong><small>从空白或结构建议开始</small>
            </button>
          </div>

          <div className="timeline-bar">
            <div className="time-ruler"><span>00:00</span><span>00:10</span><span>00:20</span><span>00:30</span><span>00:40</span></div>
            <div className="clips">
              {shots.map((shot, i) => <button key={shot.id} onClick={() => setSelectedShot(i)} className={selectedShot === i ? "active" : ""} style={{ flex: Number(shot.time.slice(0, -1)) }}>{shot.id}<small>{shot.time}</small></button>)}
            </div>
          </div>
        </section>

        <aside className="inspector">
          <div className="inspector-head">
            <div><span>镜头 {shots[selectedShot].id}</span><strong>{shots[selectedShot].title}</strong></div>
            <button aria-label="更多">•••</button>
          </div>
          <div className="tabs"><button className="active">镜头设置</button><button>生成记录</button></div>

          <div className="inspect-scroll">
            <fieldset>
              <legend>画面内容 <button>⌁</button></legend>
              <textarea defaultValue={shots[selectedShot].desc} key={selectedShot} />
              <div className="keep-row"><span>保持舰船型号、比例与环境设定</span><button className="toggle on"><i /></button></div>
            </fieldset>

            <fieldset>
              <legend>镜头语言</legend>
              <label>景别<select defaultValue={shots[selectedShot].type} key={`type-${selectedShot}`}><option>远景</option><option>中景</option><option>近景</option><option>特写</option></select></label>
              <label>机位<select><option>海面低机位</option><option>平视</option><option>空中俯瞰</option></select></label>
              <label className="wide">运镜<select><option>环绕跟随</option><option>固定镜头</option><option>高速跟拍</option><option>缓慢拉远</option></select></label>
            </fieldset>

            <fieldset>
              <legend>动作设计 <button>⌁</button></legend>
              <label className="wide">主体动作<textarea defaultValue="舰船保持稳定航向高速前进，主炮按设定方位转向并完成射击动作。" /></label>
              <label className="wide">环境运动<textarea defaultValue="中高海浪连续起伏，舰艏劈浪形成飞沫，尾流随航速自然扩散。" /></label>
            </fieldset>

            <fieldset>
              <legend>约束条件</legend>
              <div className="constraint"><span>保持舰船型号与装备布局准确</span><button>×</button></div>
              <div className="constraint"><span>保持舰体尺度、海浪和运动关系真实</span><button>×</button></div>
              <button className="add-constraint">＋ 添加约束</button>
            </fieldset>
          </div>

          <div className="inspector-foot">
            <button className="ai-adjust" onClick={() => notify("已准备智能调整建议")}>✦ 智能调整</button>
            <button className="confirm" onClick={() => notify(`镜头 ${shots[selectedShot].id} 已确认`)}>确认镜头</button>
          </div>
        </aside>
        </>
        ) : (
          <StageView
            index={activeStage}
            onBack={() => setActiveStage(Math.max(0, activeStage - 1))}
            onNext={() => {
              if (activeStage < 8) {
                setActiveStage(activeStage + 1);
                notify(`已进入：${stages[activeStage + 1][1]}`);
              } else {
                notify("项目流程检查完成");
              }
            }}
            notify={notify}
          />
        )}
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
