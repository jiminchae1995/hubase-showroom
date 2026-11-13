import type { NextConfig } from "next";

const pagesBasePath = process.env.NEXT_PUBLIC_SHOWROOM_BASE_PATH;

const config: NextConfig = {
  ...(pagesBasePath ? { output: "export", basePath: pagesBasePath } : {}),
  poweredByHeader: false,
  devIndicators: false,
  images: { qualities: [75, 90], unoptimized: Boolean(pagesBasePath) },
};
export default config;
