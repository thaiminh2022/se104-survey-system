import { expect, test } from "@playwright/test";
import { signInForE2E } from "./helpers";

test.beforeEach(async ({ context }) => {
  await signInForE2E(context);
});

test("survey builder edits fields, adds a section, marks required, and saves draft", async ({
  page,
}) => {
  await page.goto("/dashboard/surveys/create");

  await expect(
    page.getByRole("heading", { name: "Survey builder" }),
  ).toBeVisible();

  await page.getByPlaceholder("Survey title").fill("E2E Course Feedback Draft");
  await page
    .getByPlaceholder("Tell respondents what this survey is about.")
    .fill("A browser-created survey draft.");
  await page
    .getByPlaceholder("student@example.com")
    .fill("allowed@example.com");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("allowed@example.com")).toBeVisible();

  await page.getByText("Section 1").click();
  await page.getByRole("button", { name: "Section", exact: true }).click();
  await expect(page.getByText("Section 2")).toBeVisible();

  await page.getByText("Question 1").first().click();
  await page.getByPlaceholder("Ask a clear question").first().fill("Rate us");
  await page.getByRole("checkbox", { name: "Required" }).check();
  await expect(page.getByText("Required").nth(1)).toBeVisible();

  await page.getByRole("button", { name: "Draft" }).click();
  await expect(page).toHaveURL(/\/dashboard\/surveys$/);
  await expect(
    page.getByRole("heading", { name: "Your surveys" }),
  ).toBeVisible();
});

test("survey list publish action opens confirm dialog and completes", async ({
  page,
}) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Survey is now: published");
    await dialog.accept();
  });

  await page.goto("/dashboard/surveys");
  await expect(page.getByText("E2E Draft Survey")).toBeVisible();

  await page.getByRole("button", { name: "Publish" }).last().click();
  await expect(
    page.getByRole("alertdialog").getByText("Publish this survey"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Publish" }).last().click();
});

test("edit survey loads existing content and saves through the builder", async ({
  page,
}) => {
  await page.goto("/dashboard/surveys/e2e-survey/edit");

  await expect(page.getByRole("heading", { name: "Edit survey" })).toBeVisible();
  await expect(page.getByPlaceholder("Survey title")).toHaveValue(
    "E2E Published Survey",
  );

  await page.getByPlaceholder("Survey title").fill("E2E Edited Survey");
  await page.getByRole("button", { name: /save draft/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/surveys$/);
  await expect(
    page.getByRole("heading", { name: "Your surveys" }),
  ).toBeVisible();
});
