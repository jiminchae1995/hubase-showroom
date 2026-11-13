import { assetPath } from "../data/asset-path";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const pretendard = localFont({ src: "../../public/fonts/PretendardVariable.woff2", variable: "--showroom-font", weight: "45 920", display: "swap" });

export const metadata: Metadata = {
  title: "HUBASE 쇼룸 | 약국 진열의 기준을 바꾸다",
  description:
    "작지만 확실한 변화. 휴베이스 약국 진열용품을 용도별로 살펴보고, 짧은 영상으로 우리 약국에 필요한 진열 솔루션을 만나보세요.",
  robots: { index: false, follow: false }, // 로컬 검토용. 공개 시 운영 도메인과 함께 수정하세요.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body style={{ "--showroom-reference": `url("${assetPath("/images/design-reference.png")}")` } as React.CSSProperties}>{children}</body>
    </html>
  );
}
