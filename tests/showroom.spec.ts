import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("제품 탐색: 분류, 검색, 빈 결과, 초기화", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(10);
  await page.getByRole("button", { name: "가격표 표시", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.getByRole("button", { name: "전체 10", exact: true }).click();
  await page.getByRole("searchbox").fill("칸막이");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("searchbox").fill("없는제품xyz");
  await expect(page.getByText("조건에 맞는 진열용품이 없어요.")).toBeVisible();
  await page
    .getByRole("button", { name: "전체 제품 보기", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(10);
  expect(errors).toEqual([]);
});

test("클립형 디바이더 Vimeo 모달: 연결, 포커스 가두기, ESC, 포커스 복원", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "클립형 디바이더 영상 보기",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#modal-title")).toHaveText("클립형 디바이더");
  await expect(
    page
      .getByRole("dialog")
      .getByRole("link", { name: "구매하러 가기", exact: true }),
  ).toHaveAttribute("href", "https://www.hubase.kr/goods/115161");
  await expect(page.locator(".video-stage iframe")).toHaveAttribute(
    "src",
    new RegExp("https://player.vimeo.com/video/1242714429[?]"),
  );
  await expect(
    page.getByRole("button", { name: "클립형 디바이더 영상 보기" }),
  ).toContainText("01:21");
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("쇼츠 카드 7개가 각 Vimeo 플레이어에 연결됨", async ({ page }) => {
  await page.route("https://player.vimeo.com/**", route => route.fulfill({ body: "" }));
  await page.goto("/");
  const videos = [
    ["클립형 디바이더", "1242714429"],
    ["베이스레일", "1242714431"],
    ["수동 푸셔", "1242714430"],
    ["자동 푸셔", "1246158468"],
    ["프라이스레일", "1246158458"],
    ["스윙홀더", "1246158459"],
    ["프론트선반", "1246186655"],
  ];

  for (const [name, id] of videos) {
    await page.getByRole("button", { name: name + " 영상 보기", exact: true }).click();
    const player = page.locator(".video-stage iframe");
    await expect(player).toHaveAttribute("src", new RegExp("/video/" + id + "[?]"));
    await page.getByRole("button", { name: "닫기", exact: true }).click();
    await expect(player).toHaveCount(0);
  }
});

test("캐러셀, 현장 사례, 구매 링크", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "다음 영상 카드", exact: true })
    .click();
  await expect
    .poll(() => page.locator(".shorts-track").evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0);
  await expect(page.locator(".story-card")).toHaveCount(3);
  await expect(page.locator(".stories-carousel-controls")).toHaveCount(0);
  await expect(page.locator(".story-card").first()).toHaveAttribute("href", "https://blog.naver.com/hubase_pharmacy/224267912665");
  await expect(page.locator(".story-card").first()).toHaveAttribute("target", "_blank");
  await expect(page.locator(".header-mall")).toHaveAttribute("href", "https://www.hubase.kr/shop/goods/search?keyword=%EC%A7%84%EC%97%B4%EC%9A%A9%ED%92%88");
  await expect(page.locator(".header-mall")).toHaveAttribute("target", "_blank");
  await page.getByRole("button", { name: "휴베이스몰 바로가기", exact: true }).click();
  await expect(page.locator("#modal-title")).toHaveText(
    "구매 페이지를 준비하고 있어요.",
  );
  await page.getByRole("button", { name: "쇼룸 계속 둘러보기" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const purchaseLinks = page.locator(".product-card").getByRole("link", { name: "구매하러 가기" });
  await expect(purchaseLinks).toHaveCount(8);
  for (const id of ["115261", "115209", "115159", "116095", "115443", "115161", "116632", "115157"]) {
    await expect(page.locator(`.product-card a[href="https://www.hubase.kr/goods/${id}"]`)).toHaveCount(1);
  }
});

test("모바일 메뉴 및 8개 화면 폭에서 가로 넘침 없음", async ({ page }) => {
  for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(page.locator(".product-card")).toHaveCount(10);
  }
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "진열용품" })
    .click();
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
  await expect(page).toHaveURL(/#products$/);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("접근성: 데스크톱과 모바일 WCAG A/AA 자동 검사", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
  await page
    .getByRole("button", { name: "클립형 디바이더 영상 보기", exact: true })
    .click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
