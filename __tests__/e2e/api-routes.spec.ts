import { expect, test } from "@playwright/test";

test("CSV export route redirects to login when logged out", async ({ request }) => {
  const response = await request.get(
    "/dashboard/analytics/e2e-survey/export/csv",
    { maxRedirects: 0 },
  );

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/auth/login");
});

test("CSV export route returns data when logged in", async ({ request }) => {
  const response = await request.get(
    "/dashboard/analytics/e2e-survey/export/csv?submissionMeta=1&questionMeta=1",
    {
      maxRedirects: 0,
      headers: {
        Cookie: "e2e-auth=1",
      },
    },
  );

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("text/csv; charset=utf-8");
  expect(response.headers()["content-disposition"]).toContain(
    "e2e-published-survey-responses.csv",
  );
  await expect(response.text()).resolves.toContain("Your name");
});
