export const categories = [
  "전체",
  "상품 정리",
  "자동·수동 진열",
  "가격표 표시",
  "진열 공간 확장",
] as const;
export type Category = (typeof categories)[number];
export type Illustration =
  "pop" | "shelf" | "swing" | "pusher" | "rail" | "divider";

export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  category: Exclude<Category, "전체">[];
  imageUrl: string | null;
  videoUrl: string | null;
  videoThumbnail: string | null;
  videoPreviewUrl?: string;
  purchaseUrl: string | null;
  searchTags: string[];
  illustration: Illustration;
  shortTitle: string;
  videoDuration: string | null;
  videoCaptionsUrl?: string;
};

// 실제 자료를 받은 뒤 null을 '/images/파일명.webp', '/videos/파일명.mp4',
// 검증된 https 구매 URL 등으로 교체합니다. 미입력 항목은 준비 상태로 표시됩니다.
const pendingMedia = {
  imageUrl: null,
  videoUrl: null,
  videoThumbnail: null,
  purchaseUrl: null,
  videoDuration: null,
};
export const products: Product[] = [
  {
    ...pendingMedia,
    id: "front-shelf",
    purchaseUrl: "https://www.hubase.kr/goods/116632",
    imageUrl: "/images/products/front-shelf-studio-v2.png",
    videoUrl: "/videos/showroom/front-shelf.mp4",
    videoDuration: "00:47",
    name: "프론트선반",
    shortDescription: "선반 앞쪽에 더하는 새로운 진열 공간.",
    category: ["진열 공간 확장", "상품 정리"],
    searchTags: ["추가", "확장", "선반", "앞쪽"],
    illustration: "shelf",
    shortTitle: "작은 공간의 가능성",
  },
  {
    ...pendingMedia,
    id: "swing-holder",
    purchaseUrl: "https://www.hubase.kr/goods/116095",
    imageUrl: "/images/products/swing-holder-studio.png",
    videoUrl: "/videos/showroom/swing-holder.mp4",
    videoDuration: "00:24",
    name: "스윙홀더",
    shortDescription: "후크에 걸린 상품도 안내가 잘 보이도록.",
    category: ["가격표 표시"],
    searchTags: ["후크", "안내", "걸이", "스윙"],
    illustration: "swing",
    shortTitle: "더 잘 보이는 안내",
  },
  {
    ...pendingMedia,
    id: "fridge-rail",
    purchaseUrl: "https://www.hubase.kr/goods/115261",
    imageUrl: "/images/products/fridge-rail-studio.png",
    name: "프라이스레일",
    shortDescription: "냉장고 안 가격표도 한눈에 읽기 쉽게.",
    category: ["가격표 표시"],
    searchTags: ["냉장고", "가격", "라벨", "가격표"],
    illustration: "rail",
    shortTitle: "냉장 진열도 깔끔하게",
  },
  {
    ...pendingMedia,
    id: "divider-base",
    purchaseUrl: "https://www.hubase.kr/goods/115209",
    imageUrl: "/images/products/base-rail-studio.png",
    videoUrl: "/videos/showroom/divider-base.mp4",
    videoDuration: "00:32",
    videoThumbnail: "/images/video-thumbnails/divider-base.webp",
    videoPreviewUrl: "/videos/previews/divider-base.mp4",
    name: "베이스레일",
    shortDescription: "진열 구획의 기준을 잡아주는 베이스레일.",
    category: ["상품 정리"],
    searchTags: ["칸막이", "분리", "구획", "정돈", "레일"],
    illustration: "rail",
    shortTitle: "정리의 기준을 세우다",
  },
  {
    ...pendingMedia,
    id: "clip-divider",
    purchaseUrl: "https://www.hubase.kr/goods/115161",
    videoUrl: "/videos/showroom/clip-divider.mp4",
    videoDuration: "00:36",
    videoThumbnail: "/images/video-thumbnails/clip-divider.webp",
    videoPreviewUrl: "/videos/previews/clip-divider.mp4",
    imageUrl: "/images/products/clip-divider-studio.webp",
    name: "클립형 디바이더",
    shortDescription: "상품 사이의 경계를 나누어 가지런하게.",
    category: ["상품 정리"],
    searchTags: ["칸막이", "분리", "구분", "클립"],
    illustration: "divider",
    shortTitle: "한 칸의 차이",
  },
  {
    ...pendingMedia,
    id: "manual-pusher",
    purchaseUrl: "https://www.hubase.kr/goods/115159",
    imageUrl: "/images/products/manual-pusher-studio.png",
    videoUrl: "/videos/showroom/manual-pusher.mp4",
    videoDuration: "01:41",
    videoThumbnail: "/images/video-thumbnails/manual-pusher.webp",
    videoPreviewUrl: "/videos/previews/manual-pusher.mp4",
    name: "수동 푸셔",
    shortDescription: "손쉽게 앞으로, 흐트러진 진열을 정돈하다.",
    category: ["자동·수동 진열", "상품 정리"],
    searchTags: ["수동", "밀기", "앞으로", "정렬"],
    illustration: "pusher",
    shortTitle: "손쉽게, 가지런하게",
  },
  {
    ...pendingMedia,
    id: "auto-pusher",
    purchaseUrl: "https://www.hubase.kr/goods/115443",
    imageUrl: "/images/products/auto-pusher-studio.png",
    videoUrl: "/videos/showroom/auto-pusher.mp4",
    videoDuration: "00:23",
    name: "자동 푸셔",
    shortDescription: "상품이 빠진 자리도 앞으로 채우는 진열.",
    category: ["자동·수동 진열", "상품 정리"],
    searchTags: ["자동", "밀기", "정렬"],
    illustration: "pusher",
    shortTitle: "알아서 채우는 앞자리",
  },
  {
    ...pendingMedia,
    id: "standard-rail",
    purchaseUrl: "https://www.hubase.kr/goods/115157",
    imageUrl: "/images/products/standard-rail-studio.png",
    videoUrl: "/videos/showroom/standard-rail.mp4",
    videoDuration: "00:21",
    name: "프라이스레일",
    shortDescription: "진열대 가격 정보를 한 줄로 깔끔하게.",
    category: ["가격표 표시"],
    searchTags: ["가격", "라벨", "가격표", "표준"],
    illustration: "rail",
    shortTitle: "가격표까지 단정하게",
  },
];

export const shortProductIds = [
  "clip-divider",
  "divider-base",
  "manual-pusher",
  "auto-pusher",
  "standard-rail",
  "swing-holder",
  "front-shelf",
];

export type Story = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  imageAlt: string;
};
export const stories: Story[] = [
  {
    id: "communicative-display",
    title: "상담을 돕는 진열, 신뢰를 만드는 변화",
    description: "고객과의 상담과 신뢰를 돕는 진열 이야기를 블로그에서 만나보세요.",
    url: "https://blog.naver.com/hubase_pharmacy/224267912665",
    imageUrl: "/images/stories/story-03.webp",
    imageAlt: "약사가 고객에게 진열 상품을 설명하는 모습",
  },
  {
    id: "display-principles",
    title: "휴베이스의 진열원칙",
    description: "휴베이스가 전하는 약국 진열 원칙을 블로그에서 확인해보세요.",
    url: "https://blog.naver.com/hubase_pharmacy/224297733662",
    imageUrl: "/images/stories/story-02-consulting-v2.webp",
    imageAlt: "검정 휴베이스 카라티를 입은 남성이 약사에게 진열을 컨설팅하는 일러스트",
  },
  {
    id: "lasting-display",
    title: "약국 진열, 왜 금방 무너질까?",
    description: "약국 진열이 흐트러지는 이유와 개선 아이디어를 블로그에서 확인해보세요.",
    url: "https://blog.naver.com/hubase_pharmacy/224304104108?trackingCode=blog_bloghome_searchlist",
    imageUrl: "/images/stories/story-01.webp",
    imageAlt: "어수선한 진열대 앞에서 고민하는 약사 일러스트",
  },
];

export const showroom = {
  headerMallUrl: "https://www.hubase.kr/shop/goods/search?keyword=%EC%A7%84%EC%97%B4%EC%9A%A9%ED%92%88",
  mallUrl: null as string | null,
  heroImageUrl: "/images/hero-pharmacy-upscaled-v2.webp" as string | null,
  heroImageAlt: "휴베이스 약국 내부와 진열대 모습 (AI 보정 이미지)",
};

export function safePurchaseUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function getVimeoEmbedUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isVimeoHost =
      url.hostname === "vimeo.com" ||
      url.hostname === "www.vimeo.com" ||
      url.hostname === "player.vimeo.com";
    if (url.protocol !== "https:" || !isVimeoHost) return null;

    const match = url.pathname.match(
      url.hostname === "player.vimeo.com"
        ? /^\/video\/(\d+)\/?$/
        : /^\/(\d+)\/?$/,
    );
    if (!match) return null;

    const embed = new URL(`https://player.vimeo.com/video/${match[1]}`);
    const privacyHash = url.searchParams.get("h");
    if (privacyHash && /^[a-zA-Z0-9]+$/.test(privacyHash)) {
      embed.searchParams.set("h", privacyHash);
    }
    embed.searchParams.set("autoplay", "1");
    embed.searchParams.set("app_id", "122963");
    embed.searchParams.set("title", "0");
    embed.searchParams.set("byline", "0");
    embed.searchParams.set("portrait", "0");
    return embed.href;
  } catch {
    return null;
  }
}
