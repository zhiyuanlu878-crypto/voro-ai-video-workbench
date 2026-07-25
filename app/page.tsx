"use client";

import { useState } from "react";

const stages = [
  ["01", "需求", "已锁定"],
  ["02", "创作方案", "已锁定"],
  ["03", "内容结构", "已完成"],
  ["04", "场景", "3 个场景"],
  ["05", "分镜", "编辑中"],
  ["06", "视觉设定", "待确认"],
  ["07", "关键帧", "未开始"],
  ["08", "视频片段", "未开始"],
  ["09", "合成", "未开始"],
];

const shots = [
  { id: "01", title: "远洋航行", desc: "主力水面舰船编队在中等海况下高速航行，展现舰体与尾流", time: "8s", type: "大全景", color: "blue", weather: "晴朗 · 3级浪" },
  { id: "02", title: "舰体展示", desc: "环绕展示舰船三维模型、舰桥、雷达和甲板装备细节", time: "8s", type: "全景", color: "green", weather: "多云 · 2级浪" },
  { id: "03", title: "主炮射击", desc: "舰艏主炮向海面目标射击，呈现炮口火焰、烟尘与舰体反馈", time: "6s", type: "中远景", color: "red", weather: "阴天 · 4级浪" },
  { id: "04", title: "舰载机起飞", desc: "舰载机从甲板完成启动、滑行并起飞，甲板人员保持安全距离", time: "8s", type: "广角", color: "amber", weather: "晴朗 · 2级浪" },
  { id: "05", title: "编队对抗", desc: "两支不同编队在复杂海况下机动对抗，保持真实尺度与空间关系", time: "10s", type: "超远景", color: "violet", weather: "风雨 · 5级浪" },
];

export default function Home() {
  const [activeStage, setActiveStage] = useState(4);
  const [selectedShot, setSelectedShot] = useState(2);
  const [locked, setLocked] = useState(false);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"board" | "timeline">("board");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">V</span>
          <span>VORO</span>
          <span className="brand-sub">通用视频制作工作台</span>
        </div>
        <div className="project-name">
          <button aria-label="返回项目">‹</button>
          <div>
            <strong>海洋舰船装备效果演示</strong>
            <span>装备演示 · 40 秒 · 16:9</span>
          </div>
          <span className="saved">✓ 已保存</span>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={() => notify("已打开版本记录")}>↶ 版本记录</button>
          <button className="provider" onClick={() => notify("可接入任意图像、视频、声音生成服务")}>◇ 生成服务 · 未配置</button>
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
            <strong>项目进度</strong><span>38%</span>
            <div className="progress"><i /></div>
          </div>
          <nav className="stage-list">
            {stages.map((stage, index) => (
              <button
                key={stage[1]}
                className={`${activeStage === index ? "active" : ""} ${index < 4 ? "done" : ""}`}
                onClick={() => setActiveStage(index)}
              >
                <span className="stage-num">{index < 4 ? "✓" : stage[0]}</span>
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
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
