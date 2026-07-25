import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VORO · AI视频制作工作台",
  description: "将文字视频制作拆成可生成、可调整、可回退的完整流程。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
