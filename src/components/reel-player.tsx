"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Heart, Share2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { assetPath } from "../data/asset-path";
import { safePurchaseUrl, type Product } from "@/data/showroom";

export function ReelPlayer({ products, initialIndex }: { products: Product[]; initialIndex: number }) {
  const feed = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLProgressElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [likedIds, setLikedIds] = useState(() => {
    try {
      return new Set(products.filter((item) => localStorage.getItem("hubase:like:" + item.id) === "1").map((item) => item.id));
    } catch { return new Set<string>(); }
  });
  const [shareResult, setShareResult] = useState<{ id: string; link?: string } | null>(null);
  const product = products[index];
  const liked = likedIds.has(product.id);

  function toggleLike() {
    const next = new Set(likedIds);
    if (liked) next.delete(product.id);
    else next.add(product.id);
    setLikedIds(next);
    try {
      const key = "hubase:like:" + product.id;
      if (liked) localStorage.removeItem(key);
      else localStorage.setItem(key, "1");
    } catch { /* Keep the selection for this visit if browser storage is unavailable. */ }
  }

  async function shareVideo() {
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set("reel", product.id);
    setShareResult(null);
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name + " | 휴베이스 약국 솔루션", url: url.href });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url.href);
      setShareResult({ id: product.id });
    } catch {
      setShareResult({ id: product.id, link: url.href });
    }
  }

  const purchase = safePurchaseUrl(product.purchaseUrl);

  function move(direction: number) {
    const track = feed.current;
    if (track) track.scrollTo({ top: (index + direction) * track.clientHeight, behavior: "instant" });
  }

  function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (!player.paused) player.pause();
    else {
      if (player.error) { setFailed(false); player.load(); }
      void player.play().catch(() => setPlaying(false));
    }
  }

  return (
    <div className="reel-view" onKeyDown={(event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        move(event.key === "ArrowDown" ? 1 : -1);
      }
    }}>
      <div className="reel-feed" ref={feed} data-start={initialIndex} onScroll={(event) => {
        const track = event.currentTarget;
        const next = Math.max(0, Math.min(products.length - 1, Math.round(track.scrollTop / track.clientHeight)));
        if (next !== index) {
          if (progress.current) progress.current.value = 0;
          setPlaying(false);
          setFailed(false);
          setShareResult(null);
          setIndex(next);
        }
      }}>
        {products.map((item, i) => (
          <div className="reel-slide" key={item.id} aria-hidden={i !== index}
            style={{ backgroundImage: item.videoThumbnail ? `url("${assetPath(item.videoThumbnail)}")` : undefined }}>
            {i === index && item.videoUrl && (
              <video ref={video} src={assetPath(item.videoUrl)} playsInline autoPlay loop muted={muted}
                poster={item.videoThumbnail ? assetPath(item.videoThumbnail) : undefined}
                aria-label={item.name + " 소개 영상"} onClick={togglePlayback}
                onTimeUpdate={(event) => {
                  const player = event.currentTarget;
                  if (progress.current && player.duration > 0) progress.current.value = player.currentTime / player.duration;
                }}
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                onError={() => { setPlaying(false); setFailed(true); }}>
                {item.videoCaptionsUrl && <track kind="captions" src={assetPath(item.videoCaptionsUrl)} srcLang="ko" label="한국어" default />}
              </video>
            )}
          </div>
        ))}
      </div>
      <div className="reel-playback">
        <button onClick={togglePlayback} aria-label={playing ? "일시 정지" : "재생"}>{playing ? <Pause /> : <Play />}</button>
        <button onClick={() => setMuted(!muted)} aria-label={muted ? "소리 켜기" : "소리 끄기"}>{muted ? <VolumeX /> : <Volume2 />}</button>
      </div>
      <span className="reel-count">{index + 1} / {products.length}</span>
      <div className="reel-footer">
        <div className="reel-details" aria-live="polite">
          <div className="reel-profile">
            <img src={assetPath("/icon.png")} alt="" width="30" height="30" />
            <span>@휴베이스 약국 솔루션</span>
            {purchase && <a className="reel-purchase" href={purchase} target="_blank" rel="noopener noreferrer" aria-label={product.name + " 구매하기"}>구매</a>}
          </div>
          <h2 id="modal-title">{product.name}</h2>
          <p className="reel-description">{product.shortDescription}</p>
          {shareResult?.id === product.id && (
            shareResult.link
              ? <label className="reel-share-link">영상 링크 복사<input aria-label="영상 링크" readOnly value={shareResult.link} onFocus={(event) => event.target.select()} /></label>
              : <p role="status">영상 링크를 복사했어요.</p>
          )}
          {failed && <p role="status">영상을 불러오지 못했어요. 재생 버튼을 눌러 다시 시도하세요.</p>}
        </div>
        <div className="reel-controls">
          <button className="reel-social" aria-label="좋아요" title="이 브라우저에서 누른 좋아요" aria-pressed={liked} onClick={toggleLike}>
            <Heart fill={liked ? "currentColor" : "none"} /><span>{liked ? 1 : 0}</span>
          </button>
          <button className="reel-social" aria-label="공유" onClick={shareVideo}>
            <Share2 /><span>공유</span>
          </button>
          <button disabled={index === 0} onClick={() => move(-1)} aria-label="이전 제품 영상"><ChevronUp /></button>
          <button disabled={index === products.length - 1} onClick={() => move(1)} aria-label="다음 제품 영상"><ChevronDown /></button>
        </div>
      </div>
      <progress className="reel-progress" ref={progress} value={0} max={1} aria-label="영상 재생 진행률" />
    </div>
  );
}
