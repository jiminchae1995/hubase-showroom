import { test, expect } from "@playwright/test";

test("영상 지연 로딩, 10초 순환, 호버 우선 재생과 모달 전환", async ({ page }) => {
  test.setTimeout(45_000);
  const requestedVideos: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) requestedVideos.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  expect(requestedVideos).toEqual([]);
  const first = page.getByRole("button", { name: "클립형 디바이더 영상 보기", exact: true });
  await first.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(first).toHaveClass(/is-previewing/);
  const scrollY = await page.evaluate(() => window.scrollY);
  const second = page.getByRole("button", { name: "베이스레일 영상 보기", exact: true });
  await expect(second).toHaveClass(/is-previewing/, { timeout: 14_000 });
  expect(Math.abs(await page.evaluate(() => window.scrollY) - scrollY)).toBeLessThan(2);
  expect(requestedVideos.every((url) => url.includes("/videos/previews/"))).toBe(true);

  // Exercise the visibility event without relying on OS window focus.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".short-preview")).toHaveCount(0);
  await page.evaluate(() => {
    delete (document as unknown as Record<string, unknown>).hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(second).toHaveClass(/is-previewing/);

  await first.hover();
  await expect(first).toHaveClass(/is-previewing/);
  await expect(page.locator(".short-preview")).toHaveCount(1);
  expect(await first.locator("video").evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  const hoverPlayer = await first.locator("video").elementHandle();
  await page.mouse.move(0, 0);
  await expect(first.locator("video")).toHaveCount(0);
  expect(await hoverPlayer!.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  await expect(second).toHaveClass(/is-previewing/);

  await first.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".short-preview")).toHaveCount(0);
  await expect(page.locator(".video-stage video source")).toHaveAttribute("src", "/videos/showroom/clip-divider.mp4");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.locator("#products").scrollIntoViewIfNeeded();
  await expect(page.locator(".short-preview")).toHaveCount(0);
});

test("동작 줄이기 설정에서는 자동·호버 미리보기 생략", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("button", { name: "수동 푸셔 영상 보기", exact: true });
  await card.hover();
  await expect(page.locator(".short-preview")).toHaveCount(0);
  await card.dispatchEvent("pointerenter", { pointerType: "touch" });
  await expect(page.locator(".short-preview")).toHaveCount(0);
});

test("도입 사례는 데스크톱 3개 표시, 추가 시 및 모바일에서 캐러셀 활성화", async ({ page }) => {
  await page.goto("/");
  const track = page.locator(".story-grid");
  await track.scrollIntoViewIfNeeded();
  await expect(page.locator(".stories-carousel-controls")).toHaveCount(0);
  await expect.poll(() => track.locator("img").evaluateAll((images) => images.every((img) => (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await track.evaluate((element) => element.appendChild(element.firstElementChild!.cloneNode(true)));
  const next = page.getByRole("button", { name: "다음 도입 사례" });
  await expect(next).toBeEnabled();
  await next.click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await page.reload();
  await page.setViewportSize({ width: 390, height: 844 });
  await track.scrollIntoViewIfNeeded();
  await expect(next).toBeEnabled();
  await next.click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
