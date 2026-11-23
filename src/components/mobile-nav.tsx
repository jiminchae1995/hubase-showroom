import { Grid2X2, House, Play, Store } from "lucide-react";

const mobileNavItems = [
  { label: "홈", id: "showroom", Icon: House },
  { label: "제품", id: "products", Icon: Grid2X2 },
  { label: "쇼츠", id: "shorts", Icon: Play },
  { label: "도입 사례", id: "stories", Icon: Store },
];

export function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className={onNavigate ? "mobile-tab-bar reel-nav" : "mobile-tab-bar"} aria-label="쇼룸 바로가기">
      {mobileNavItems.map(({ label, id, Icon }) => (
        <a key={id} href={`#${id}`} onClick={onNavigate} aria-current={onNavigate && id === "shorts" ? "location" : undefined}>
          <Icon size={21} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
