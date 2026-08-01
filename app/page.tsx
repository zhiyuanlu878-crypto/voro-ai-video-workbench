"use client";

export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        height: "100dvh",
        minHeight: "100svh",
        margin: 0,
        overflow: "hidden",
        background: "#0b0e13",
      }}
    >
      <iframe
        title="AI 视频制作工作台企业级原型"
        src="/prototype.html"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          minHeight: 0,
          border: 0,
        }}
        allow="autoplay; fullscreen; picture-in-picture"
      />
    </main>
  );
}
