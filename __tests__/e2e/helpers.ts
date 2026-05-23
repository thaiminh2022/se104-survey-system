import type { BrowserContext, Page } from "@playwright/test";

export async function signInForE2E(context: BrowserContext) {
  await context.addCookies([
    {
      name: "e2e-auth",
      value: "1",
      domain: "localhost",
      path: "/",
    },
  ]);
}

export async function loginThroughForm(page: Page, returnUrl = "/dashboard") {
  await page.goto(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  await page.getByLabel("Email").fill("e2e@example.com");
  await page.getByLabel("Password").fill("password");

  await Promise.all([
    page.waitForURL(returnUrl),
    page.getByRole("button", { name: "Login" }).click(),
  ]);
}
