import { assetPath } from "../data/asset-path";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";

const pretendard = localFont({ src: "../../public/fonts/PretendardVariable.woff2", variable: "--showroom-font", weight: "45 920", display: "swap" });

export const viewport: Viewport = { viewportFit: "cover" };

const title = "휴베이스 진열용품";
const description = "우리 약국에 필요한 진열용품 알아보기";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "ko_KR" },
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
