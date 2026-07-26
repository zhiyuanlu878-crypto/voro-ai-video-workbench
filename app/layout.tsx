import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 视频制作工作台｜企业级原型",
  description:
    "面向企业的视频生成工作流原型，覆盖需求策划、脚本分镜、关键帧、视频、声音、精剪与交付。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
