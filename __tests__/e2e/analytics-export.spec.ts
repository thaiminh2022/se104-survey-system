import { expect, test } from "@playwright/test";
import { signInForE2E } from "./helpers";

test.beforeEach(async ({ context }) => {
  await signInForE2E(context);
});

test("analytics page shows metrics and loads answer charts", async ({ page }) => {
  await page.goto("/dashboard/analytics/e2e-survey");

  await expect(
    page.getByRole("heading", { name: "E2E Published Survey" }),
  ).toBeVisible();
  await expect(page.getByText("Views", { exact: true })).toBeVisible();
  await expect(page.getByText("Submissions", { exact: true })).toBeVisible();
  await expect(page.getByText("50%")).toBeVisible();

  await page.getByRole("button", { name: "Load answer charts" }).click();
  await expect(page.getByText("Your name")).toBeVisible();
  await expect(page.getByText("Pick one")).toBeVisible();
});

test("CSV export downloads response data", async ({ page }) => {
  await page.goto("/dashboard/analytics/e2e-survey/export");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];

  if (!stream) {
    throw new Error("Could not read downloaded CSV");
  }

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  const csv = Buffer.concat(chunks).toString("utf8");

  expect(download.suggestedFilename()).toBe(
    "e2e-published-survey-responses.csv",
  );
  expect(csv).toContain("submission_id,respondent_user_id,submitted_at");
  expect(csv).toContain("Your name");
  expect(csv).toContain("Minh");
});

test("PDF export opens printable report and calls window.print", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      window.localStorage.setItem("e2e-print-called", "1");
    };
  });

  await page.goto("/dashboard/analytics/e2e-survey/export");
  await page.getByLabel("PDF").check();
  await page.getByRole("button", { name: "Export report" }).click();

  await expect(page).toHaveURL(/\/dashboard\/analytics\/e2e-survey\/export\/pdf/);
  await expect(page.getByText("Analytics report")).toBeVisible();
  await expect(page.getByText("E2E Published Survey")).toBeVisible();
  await expect.poll(async () =>
    page.evaluate(() => window.localStorage.getItem("e2e-print-called")),
  ).toBe("1");
});
