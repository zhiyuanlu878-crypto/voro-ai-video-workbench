import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VORO｜AI 视频制作工作台",
  description:
    "通用企业级 AI 视频制作工作台功能原型，覆盖创意计划、剧本分镜、镜头生成、剪辑声音、审核交付。",
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
