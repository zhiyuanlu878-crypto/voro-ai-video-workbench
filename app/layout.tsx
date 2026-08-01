import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VORO · AI 视频制作工作台",
  description:
    "通用企业级 AI 视频制作工作台原型，覆盖需求、策划、分镜、镜头生成、剪辑声音、质检审批与真实交付。",
  openGraph: {
    title: "VORO · AI 视频制作工作台",
    description: "从原始需求到最终成片的可编辑、可追溯 AI 视频制作流程。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <body style={{ width: "100%", height: "100%", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
