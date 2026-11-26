import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "가상 가맹 페이지 1",
};

export default function FranchisePracticePage() {
  return (
    <main className="container" style={{ paddingBlock: "clamp(48px, 10vw, 112px)" }}>
      <div className="section-heading">
        <h1>가상 가맹 페이지 1</h1>
        <p>쇼룸 하단 로고 링크를 확인하는 실습 페이지입니다.</p>
      </div>
      <Link className="button" href="/">
        쇼룸으로 돌아가기
      </Link>
    </main>
  );
}
