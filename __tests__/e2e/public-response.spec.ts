import { expect, test } from "@playwright/test";

test("required answers gate section navigation and submit successfully", async ({
  page,
}) => {
  await page.goto("/surveys/e2e-survey");

  await expect(page.getByText("E2E Published Survey")).toBeVisible();
  await expect(page.getByText("Section 1 of 2")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();

  await page.getByPlaceholder("Name").fill("Browser respondent");
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();

  await page.getByRole("radio", { name: "A" }).click();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await expect(page.getByText("Section 2 of 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();

  await page.getByLabel("Yes").click();
  await page.getByLabel("I agree to participate.").check();
  await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Response submitted")).toBeVisible();
});

test("multi-section back navigation keeps completed section valid", async ({
  page,
}) => {
  await page.goto("/surveys/e2e-survey");

  await page.getByPlaceholder("Name").fill("Back tester");
  await page.getByRole("radio", { name: "B" }).click();

  const nextButton = page.getByRole("button", { name: "Next", exact: true });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  await expect(page.getByText("Section 2 of 2")).toBeVisible();
  await page.getByRole("button", { name: "Back" }).click();

  await expect(page.getByText("Section 1 of 2")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeEnabled();
});
