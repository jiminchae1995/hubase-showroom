"use client";

import { assetPath } from "../data/asset-path";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Film, ImageIcon, X } from "lucide-react";
import type { Product, Story } from "@/data/showroom";
import { getVimeoEmbedUrl, safePurchaseUrl } from "@/data/showroom";
import { MediaImage } from "./media-image";

export type ModalContent =
  | { type: "video"; product: Product }
  | { type: "story"; story: Story }
  | { type: "mall" };

export default function Modal({
  content,
  onClose,
}: {
  content: ModalContent;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const current = dialog.current;
    const oldOverflow = document.body.style.overflow;
    current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      current?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const close = () => {
    video.current?.pause();
    onClose();
  };
  const product = content.type === "video" ? content.product : null;
  const purchase = product ? safePurchaseUrl(product.purchaseUrl) : null;
  const vimeoEmbedUrl = product ? getVimeoEmbedUrl(product.videoUrl) : null;
  return (
    <dialog
      ref={dialog}
      className={`media-dialog ${content.type === "mall" ? "small-dialog" : ""}`}
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const focusable = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], video[controls], iframe, [tabindex="0"]',
          ),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button modal-close"
          onClick={close}
          aria-label="닫기"
          autoFocus
        >
          <X size={21} />
        </button>
        {product && (
          <div className="video-layout">
            <div className="video-stage">
              {vimeoEmbedUrl ? (
                <iframe
                  src={vimeoEmbedUrl}
                  title={`${product.name} 소개 영상`}
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : product.videoUrl && !videoFailed ? (
                <video
                  ref={video}
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  poster={product.videoThumbnail ? assetPath(product.videoThumbnail) : undefined}
                  onError={() => setVideoFailed(true)}
                  aria-label={`${product.name} 소개 영상`}
                >
                  <source
                    src={assetPath(product.videoUrl)}
                    onError={() => setVideoFailed(true)}
                  />
                  {product.videoCaptionsUrl && (
                    <track
                      kind="captions"
                      src={assetPath(product.videoCaptionsUrl)}
                      srcLang="ko"
                      label="한국어"
                      default
                    />
                  )}
                </video>
              ) : (
                <div className="video-pending">
                  <Film size={28} />
                  <strong>
                    {videoFailed
                      ? "영상을 불러오지 못했습니다"
                      : "조금 더 가까이, 곧 만나요"}
                  </strong>
                  <p>
                    {videoFailed
                      ? "잠시 후 다시 시도해 주세요."
                      : "이 제품의 소개 영상을 준비하고 있습니다."}
                  </p>
                  <span>HUBASE SHORTS</span>
                </div>
              )}
            </div>
            <div className="modal-copy">
              <span className="eyebrow">DISPLAY SOLUTION</span>
              <h2 id="modal-title">{product.name}</h2>
              <p>{product.shortDescription}</p>
              <div className="tag-row">
                {product.category.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <div className="modal-purchase">
                <p>우리 약국에 맞는 진열용품을 만나보세요.</p>
                {purchase ? (
                  <a
                    className="button primary"
                    href={purchase}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    구매하러 가기
                    <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <>
                    <button className="button unavailable" disabled>
                      구매 링크 준비 중
                    </button>
                    <small>구매 페이지가 연결되면 이용할 수 있습니다.</small>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {content.type === "story" && (
          <div className="story-detail">
            <div className="story-detail-image">
              <MediaImage
                src={content.story.imageUrl}
                alt={content.story.imageAlt}
                sizes="(max-width: 768px) 90vw, 850px"
                fallback={
                  <div className="story-pending">
                    <ImageIcon size={40} />
                    <span>실제 현장 사진 준비 중</span>
                  </div>
                }
              />
            </div>
            <div className="story-detail-copy">
              <span className="eyebrow">REAL PHARMACY STORY</span>
              <h2 id="modal-title">{content.story.title}</h2>
              <p>{content.story.description}</p>
            </div>
          </div>
        )}
        {content.type === "mall" && (
          <div className="mall-message">
            <span className="eyebrow">HUBASE MALL</span>
            <h2 id="modal-title">구매 페이지를 준비하고 있어요.</h2>
            <p>
              휴베이스몰 링크가 연결되면
              <br />
              이곳에서 바로 이동할 수 있습니다.
            </p>
            <button className="button primary" onClick={close}>
              쇼룸 계속 둘러보기
              <ArrowUpRight size={18} />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
