"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { assetPath } from "../data/asset-path";
import { safePurchaseUrl, type Product } from "@/data/showroom";

export function ReelPlayer({ products, initialIndex }: { products: Product[]; initialIndex: number }) {
  const feed = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const product = products[index];
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
          setPlaying(false);
          setFailed(false);
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
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                onError={() => { setPlaying(false); setFailed(true); }}>
                {item.videoCaptionsUrl && <track kind="captions" src={assetPath(item.videoCaptionsUrl)} srcLang="ko" label="한국어" default />}
              </video>
            )}
          </div>
        ))}
      </div>
      <span className="reel-count">{index + 1} / {products.length}</span>
      <div className="reel-footer">
        <div className="reel-details" aria-live="polite">
          <h2 id="modal-title">{product.name}</h2>
          {failed && <p role="status">영상을 불러오지 못했어요. 재생 버튼을 눌러 다시 시도하세요.</p>}
          {purchase && <a className="reel-purchase" href={purchase} target="_blank" rel="noopener noreferrer">구매하러 가기 <ArrowUpRight size={16} /></a>}
        </div>
        <div className="reel-controls">
          <button onClick={togglePlayback} aria-label={playing ? "일시 정지" : "재생"}>{playing ? <Pause /> : <Play />}</button>
          <button onClick={() => setMuted(!muted)} aria-label={muted ? "소리 켜기" : "소리 끄기"}>{muted ? <VolumeX /> : <Volume2 />}</button>
          <button disabled={index === 0} onClick={() => move(-1)} aria-label="이전 제품 영상"><ChevronUp /></button>
          <button disabled={index === products.length - 1} onClick={() => move(1)} aria-label="다음 제품 영상"><ChevronDown /></button>
        </div>
      </div>
    </div>
  );
}
