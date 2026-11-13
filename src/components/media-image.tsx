"use client";

import { assetPath } from "../data/asset-path";
import Image from "next/image";
import { useState, type ReactNode } from "react";

export function MediaImage({
  src,
  alt,
  sizes,
  priority = false,
  quality = 75,
  fallback,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  quality?: number;
  fallback: ReactNode;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <>{fallback}</>;
  return (
    <Image
      src={assetPath(src)}
      alt={alt}
      fill
      sizes={sizes}
      preload={priority}
      quality={quality}
      unoptimized={/^https?:\/\//.test(src)}
      onError={() => setFailedSrc(src)}
    />
  );
}
