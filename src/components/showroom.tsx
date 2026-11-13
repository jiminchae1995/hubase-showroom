"use client";

import { assetPath } from "../data/asset-path";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  ImageIcon,
  Layers3,
  Menu,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  categories,
  products,
  shortProductIds,
  showroom,
  stories,
  safePurchaseUrl,
  type Category,
  type Product,
} from "@/data/showroom";
import { Reveal } from "./reveal";
import { MediaImage } from "./media-image";
import { ShortVideoCard } from "./short-video-card";
import { useCarouselEdges } from "./use-carousel-edges";
import type { ModalContent } from "./modal";

const Modal = dynamic(() => import("./modal"), { ssr: false });
const shorts = shortProductIds.map((id) => products.find((p) => p.id === id)!);
const autoPreviewShorts = shorts.filter((product) => Boolean(product.videoPreviewUrl));
const navItems = [
  ["쇼룸", "showroom"],
  ["진열용품", "products"],
  ["영상", "shorts"],
  ["도입사례", "stories"],
];

function Logo() {
  return (
    <span className="logo">
      <Image
        src={assetPath("/images/hubase-logo.png")}
        alt="휴베이스"
        width={840}
        height={260}
        sizes="(max-width: 767px) 116px, 148px"
      />
    </span>
  );
}

export default function Showroom() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [category, setCategory] = useState<Category>("전체");
  const [query, setQuery] = useState("");
  const carousel = useRef<HTMLDivElement>(null);
  const storiesCarousel = useRef<HTMLDivElement>(null);
  const shortsSection = useRef<HTMLElement>(null);
  const carouselEdges = useCarouselEdges(carousel);
  const storyCarouselEdges = useCarouselEdges(storiesCarousel);
  const [pageVisible, setPageVisible] = useState(false);
  const [shortsInView, setShortsInView] = useState(false);
  const [hoveredShortId, setHoveredShortId] = useState<string | null>(null);
  const [autoPreviewIndex, setAutoPreviewIndex] = useState(0);
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const autoPreviewEnabled =
    shortsInView && pageVisible && !reduced && modal === null && hoveredShortId === null;
  const autoPreviewId = autoPreviewShorts[autoPreviewIndex]?.id;
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    const section = shortsSection.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShortsInView(entry.isIntersecting && entry.intersectionRatio >= 0.1),
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!autoPreviewEnabled || autoPreviewShorts.length < 2) return;
    const timer = window.setInterval(
      () => setAutoPreviewIndex((index) => (index + 1) % autoPreviewShorts.length),
      10_000,
    );
    return () => window.clearInterval(timer);
  }, [autoPreviewEnabled]);
  useEffect(() => {
    if (!autoPreviewEnabled || !autoPreviewId) return;
    const card = carousel.current?.querySelector<HTMLButtonElement>(
      `[data-short-id="${autoPreviewId}"]`,
    );
    const track = carousel.current;
    if (!card || !track) return;
    const bounds = track.getBoundingClientRect();
    const item = card.getBoundingClientRect();
    const left = item.left < bounds.left ? item.left - bounds.left
      : item.right > bounds.right ? item.right - bounds.right : 0;
    // Move only the horizontal track; never pull the page back to the videos.
    if (left) track.scrollBy({ left, behavior: reduced ? "instant" : "smooth" });
  }, [autoPreviewEnabled, autoPreviewId, reduced]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  const scrollCarousel = (direction: number) =>
    carousel.current?.scrollBy({
      left: direction * (carousel.current.clientWidth * 0.7),
      behavior: reduced ? "instant" : "smooth",
    });
  const scrollStoriesCarousel = (direction: number) =>
    storiesCarousel.current?.scrollBy({
      left: direction * (storiesCarousel.current.clientWidth * 0.7),
      behavior: reduced ? "instant" : "smooth",
    });
  const mallUrl = safePurchaseUrl(showroom.mallUrl);
  const mallButton = (className: string, label = "휴베이스몰 바로가기", url = mallUrl) =>
    url ? (
      <a
        className={className}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
        <ArrowUpRight size={17} />
      </a>
    ) : (
      <button className={className} onClick={() => setModal({ type: "mall" })}>
        {label}
        <ArrowUpRight size={17} />
      </button>
    );
  const filtered = products.filter(
    (product) =>
      (category === "전체" || product.category.includes(category)) &&
      [product.name, product.shortDescription, ...product.searchTags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const openVideo = useCallback((product: Product) => setModal({ type: "video", product }), []);

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <a
            href="#showroom"
            aria-label="휴베이스 쇼룸 홈"
            onClick={() => setMenuOpen(false)}
          >
            <Logo />
          </a>
          <nav aria-label="주 메뉴" className="desktop-nav">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <span className="header-caption">
              필요한 진열용품, 휴베이스몰에서 만나보세요.
            </span>
            {mallButton("button header-mall", "휴베이스몰", safePurchaseUrl(showroom.headerMallUrl))}
            <button
              id="menu-toggle"
              className="icon-button mobile-toggle"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="모바일 메뉴">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main">
        <section id="showroom" className="hero" ref={hero}>
          <div className="hero-background">
            {showroom.heroImageUrl ? (
              <MediaImage
                src={showroom.heroImageUrl}
                alt={showroom.heroImageAlt}
                sizes="100vw"
                priority
                quality={90}
                fallback={
                  <div className="hero-image-missing">
                    <ImageIcon />
                    <span>실제 약국 사진 준비 중</span>
                  </div>
                }
              />
            ) : (
              <div
                className="reference-image"
                role="img"
                aria-label="제공된 디자인 시안의 약국 진열 이미지. 실제 현장 사진은 준비 중입니다."
              />
            )}
          </div>
          <div className="hero-grid container">
            <motion.div
              className="hero-copy"
              style={{ y: reduced ? 0 : heroY }}
            >
              <span className="eyebrow hero-eyebrow">
                <span className="red-line" />
                Hubase Communicative Display
              </span>
              <h1>
                말을 건네는,
                <br />
                <span>커뮤니케이션 진열</span>
              </h1>
              <p className="hero-description">
                고객에게 먼저 말을 건네고,
                <br />
                약사의 설명에는 신뢰를 더합니다.
              </p>
              <div className="hero-benefits">
                <div>
                  <Grid2X2 />
                  <span>
                    <strong>고객에게 말을 걸어주는</strong>
                    <small>필요한 정보가 먼저 눈에 들어오도록</small>
                  </span>
                </div>
                <div>
                  <Layers3 />
                  <span>
                    <strong>약사의 말을 도와주는</strong>
                    <small>제품의 특징을 쉽게 설명할 수 있도록</small>
                  </span>
                </div>
                <div>
                  <ShoppingBag />
                  <span>
                    <strong>약사의 말에 신뢰를 더하는</strong>
                    <small>정돈된 진열이 설명을 뒷받침하도록</small>
                  </span>
                </div>
              </div>
            </motion.div>
            <div className="hero-visual" aria-hidden="true" />
          </div>
          <div className="hero-bottom container">
            <a href="#shorts">
              SCROLL TO EXPLORE
              <ArrowDown size={13} />
            </a>
          </div>
        </section>

        <section id="shorts" className="shorts-section section-space" ref={shortsSection}>
          <div className="container">
            <Reveal className="section-heading">
              <div>
                <span className="eyebrow">
                  HUBASE SHORTS
                </span>
                <h2>
                  30초로 만나는
                  <br className="mobile-break" /> 진열의 변화
                  <span className="red-dot">.</span>
                </h2>
              </div>
              <p>
                우리 약국에는 어떤 진열용품이 필요할까요?
                <br />
                짧은 영상으로 하나씩 살펴보세요.
              </p>
            </Reveal>
            <Reveal>
              <div className="shorts-toolbar">
                <div className="carousel-controls">
                  <button
                    className="icon-button"
                    onClick={() => scrollCarousel(-1)}
                    aria-label="이전 영상 카드"
                    disabled={carouselEdges.start}
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => scrollCarousel(1)}
                    aria-label="다음 영상 카드"
                    disabled={carouselEdges.end}
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
              <div
                ref={carousel}
                className="shorts-track"
                aria-label="진열용품 소개 영상"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.target === e.currentTarget &&
                    ["ArrowLeft", "ArrowRight"].includes(e.key)
                  ) {
                    e.preventDefault();
                    scrollCarousel(e.key === "ArrowLeft" ? -1 : 1);
                  }
                }}
              >
                {shorts.map((product, index) => (
                  <ShortVideoCard
                    key={product.id}
                    product={product}
                    index={index}
                    onOpen={openVideo}
                    autoPlay={autoPreviewEnabled && product.id === autoPreviewId}
                    onHoverChange={setHoveredShortId}
                    disabled={modal !== null || !shortsInView || !pageVisible}
                    reduced={Boolean(reduced)}
                  />
                ))}
              </div>
              <div className="shorts-bottom">
                <span className="swipe-hint">
                  옆으로 넘겨보기
                  <ArrowRight size={15} />
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="stories" className="stories-section section-space">
          <div className="container">
            <Reveal className="section-heading">
              <div>
                <span className="eyebrow">REAL PHARMACY STORY</span>
                <h2>
                  실제 약국에서 경험하는
                  <br />
                  진열의 변화<span className="red-dot">.</span>
                </h2>
              </div>
              <p>
                좋은 진열이 만들어가는 약국의 일상.
                <br />
                휴베이스 블로그에서 더 자세히 만나보세요.
              </p>
            </Reveal>
            <Reveal>
              {!(storyCarouselEdges.start && storyCarouselEdges.end) && (
                <div className="stories-carousel-controls carousel-controls">
                  <button
                    className="icon-button"
                    onClick={() => scrollStoriesCarousel(-1)}
                    aria-label="이전 도입 사례"
                    disabled={storyCarouselEdges.start}
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => scrollStoriesCarousel(1)}
                    aria-label="다음 도입 사례"
                    disabled={storyCarouselEdges.end}
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              )}
              <div
                ref={storiesCarousel}
                className="story-grid"
                role="region"
                aria-label="실제 약국 도입 사례"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    ["ArrowLeft", "ArrowRight"].includes(event.key)
                  ) {
                    event.preventDefault();
                    scrollStoriesCarousel(event.key === "ArrowLeft" ? -1 : 1);
                  }
                }}
              >
              {stories.map((story, index) => (
                <a
                  className="story-card"
                  key={story.id}
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${story.title} - 휴베이스 블로그에서 읽기`}
                >
                  <div className={`story-image story-image-${index}`}>
                    <MediaImage
                      src={story.imageUrl}
                      alt={story.imageAlt}
                      sizes="(max-width: 767px) 86vw, (max-width: 1023px) 50vw, (max-width: 1672px) 33vw, 504px"
                      fallback={
                        <>
                          <div className="shelf-outline" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </div>
                          <span className="story-asset-label">
                            <ImageIcon size={14} />
                            썸네일 준비 중
                          </span>
                        </>
                      }
                    />
                    <span className="story-label">STORY 0{index + 1}</span>
                  </div>
                  <div className="story-card-copy">
                    <div>
                      <small>
                        {story.imageUrl ? "REAL PHARMACY STORY" : "BLOG STORY"}
                      </small>
                      <h3>{story.title}</h3>
                    </div>
                    <span className="circle-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </a>
              ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="products" className="products-section section-space">
          <div className="container">
            <Reveal className="section-heading">
              <div>
                <span className="eyebrow">HUBASE PRODUCTS</span>
                <h2>
                  약국을 위한 진열 솔루션<span className="red-dot">.</span>
                </h2>
              </div>
              <p>
                제품 이름을 몰라도 괜찮아요.
                <br />
                필요한 용도부터 찾아보세요.
              </p>
            </Reveal>
            <div className="product-filters">
              <div className="filter-tabs" aria-label="진열용품 용도별 분류">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={category === c ? "active" : ""}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                    {c === "전체" && <span>{products.length}</span>}
                  </button>
                ))}
              </div>
              <label className="search-field">
                <Search size={17} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="어떤 진열이 필요하세요?"
                  aria-label="제품명 또는 용도로 검색"
                />
              </label>
            </div>
            <div className="product-count">
              <span aria-live="polite">
                {category} <strong>{filtered.length}</strong>
              </span>
            </div>
            <div className="product-grid">
              {filtered.map((product) => {
                const purchaseUrl = safePurchaseUrl(product.purchaseUrl);
                const imagePurchaseUrl = product.id === "front-shelf" ? purchaseUrl : null;
                const ProductImage = imagePurchaseUrl ? "a" : "button";
                return (
                  <article className="product-card" key={product.id}>
                    {product.imageUrl && <ProductImage
                      className="product-image"
                      {...(imagePurchaseUrl
                        ? { href: imagePurchaseUrl, target: "_blank", rel: "noopener noreferrer" }
                        : { onClick: () => openVideo(product) })}
                      aria-label={`${product.name} ${imagePurchaseUrl ? "구매 페이지 열기" : "자세히 보기"}`}
                    >
                      <span className="product-index">
                        {String(products.indexOf(product) + 1).padStart(2, "0")}
                      </span>
                      <MediaImage
                        src={product.imageUrl}
                        alt={product.name}
                        sizes="(max-width: 550px) 90vw, (max-width: 1023px) 45vw, 25vw"
                        fallback={
                          <>
                            <span className="asset-pending">
                              제품 사진 준비 중
                            </span>
                          </>
                        }
                      />
                      <span className="product-view">
                        <ArrowUpRight size={18} />
                      </span>
                    </ProductImage>}
                    <div className="product-copy">
                      <span className="product-category">
                        {product.category.join(" · ")}
                      </span>
                      <h3>{product.name}</h3>
                      <p>{product.shortDescription}</p>
                      <div className="product-actions">
                        {purchaseUrl ? (
                          <a
                            href={purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            구매하러 가기
                            <ArrowUpRight size={14} />
                          </a>
                        ) : (
                          <button
                            disabled
                            title="실제 구매 URL이 등록되면 활성화됩니다"
                          >
                            구매 링크 준비 중<ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="empty-results">
                <SlidersHorizontal size={32} />
                <h3>조건에 맞는 진열용품이 없어요.</h3>
                <p>다른 용도나 검색어로 다시 찾아보세요.</p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setCategory("전체");
                    setQuery("");
                  }}
                >
                  전체 제품 보기
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <Reveal>
              <span className="eyebrow">SMALL CHANGE, BETTER PHARMACY</span>
              <h2>
                우리 약국에 필요한
                <br />
                진열용품을 만나보세요.
              </h2>
              <p>매일의 공간에, 휴베이스의 세심한 솔루션.</p>
              <div className="cta-buttons">
                <a href="#products" className="button white-button">
                  진열용품 둘러보기
                  <ArrowRight size={18} />
                </a>
                {mallButton("button cta-outline")}
              </div>
            </Reveal>
            <div className="cta-graphic" aria-hidden="true">
              <span>H</span>
              <span>+</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div>
          <a href="#showroom" aria-label="휴베이스 쇼룸 홈">
            <Logo />
          </a>
          <p>좋은 진열이, 더 좋은 약국을 만듭니다.</p>
        </div>
        <div className="footer-right">
          <span>HUBASE SOLUTION TEAM</span>
          <small>
            © {new Date().getFullYear()} HUBASE. All rights reserved.
          </small>
          <a href="#showroom">
            맨 위로
            <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
      {modal && <Modal content={modal} onClose={() => setModal(null)} />}
    </>
  );
}
