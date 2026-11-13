"use client";

import { assetPath } from "../data/asset-path";

import { memo, useEffect, useRef, useState } from "react";
import { Play, VolumeX } from "lucide-react";
import type { Product } from "@/data/showroom";
import { MediaImage } from "./media-image";

export const ShortVideoCard = memo(function ShortVideoCard({ product, index, onOpen, autoPlay, onHoverChange, disabled, reduced }: {
  product: Product;
  index: number;
  onOpen: (product: Product) => void;
  autoPlay: boolean;
  onHoverChange: (id: string | null) => void;
  disabled: boolean;
  reduced: boolean;
}) {
  const card = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const preview = (active || autoPlay) && !disabled && !reduced && !!product.videoPreviewUrl;

  const stop = () => {
    video.current?.pause();
    setActive(false);
    setPlaying(false);
  };

  useEffect(() => {
    if (disabled && active) {
      setActive(false);
      onHoverChange(null);
    }
  }, [disabled, active, onHoverChange]);

  useEffect(() => {
    const player = video.current;
    const button = card.current;
    if (!preview || !player || !button) return;
    let cancelled = false;
    let inView = false;
    setPlaying(false);
    const suspend = () => {
      player.pause();
      setPlaying(false);
    };
    const resume = () => {
      if (!cancelled && inView && !document.hidden) {
        void player.play().catch(() => !cancelled && suspend());
      }
    };
    const visibility = () => {
      if (document.hidden) suspend();
      else resume();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) suspend();
      else resume();
    });
    observer.observe(button);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", suspend);
    window.addEventListener("focus", resume);
    player.muted = true;
    return () => {
      cancelled = true;
      player.pause();
      setPlaying(false);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", suspend);
      window.removeEventListener("focus", resume);
    };
  }, [preview]);

  return (
    <button
      ref={card}
      data-short-id={product.id}
      className={`short-card short-tone-${index % 3}${product.videoThumbnail ? " has-video-poster" : ""}${preview && playing ? " is-previewing" : ""}`}
      aria-label={`${product.name} 영상 보기`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || disabled || reduced || !product.videoPreviewUrl) return;
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          setActive(true);
          onHoverChange(product.id);
        }
      }}
      onPointerLeave={() => { stop(); onHoverChange(null); }}
      onPointerCancel={() => { stop(); onHoverChange(null); }}
      onClick={() => {
        stop();
        onHoverChange(null);
        onOpen(product);
      }}
    >
      <div className="short-poster">
        <MediaImage
          src={product.videoThumbnail}
          alt={`${product.name} 영상 썸네일`}
          sizes="(max-width: 767px) 75vw, 280px"
          fallback={
            <>
              <span className="short-placeholder">
                {product.videoUrl ? "영상 썸네일 준비 중" : "영상 준비 중"}
              </span>
            </>
          }
        />
        {preview && (
          <video
            ref={video}
            className="short-preview"
            src={assetPath(product.videoPreviewUrl!)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            onError={stop}
          />
        )}
      </div>
      <span className="short-number">{String(index + 1).padStart(2, "0")}<span>DISPLAY NOTE</span></span>
      {!product.videoThumbnail && (
        <span className="short-hook">
          {product.shortTitle.split(" ").slice(0, -1).join(" ")}<br />
          {product.shortTitle.split(" ").slice(-1)}
        </span>
      )}
      <span className="short-play"><Play size={19} fill="currentColor" /></span>
      <span className="short-preview-label" aria-hidden="true"><VolumeX size={13} />무음 미리보기</span>
      <div className="short-info">
        <span className="short-category">{product.category[0]}</span>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <span className="short-duration">{product.videoDuration || (product.videoUrl ? "영상 연결" : "COMING SOON")}</span>
      </div>
    </button>
  );
});
