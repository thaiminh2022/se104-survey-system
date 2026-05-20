import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegisterForm } from "@/components/auth/register-form";

describe("register form", () => {
  test("renders register fields", () => {
    render(<RegisterForm returnUrl="/dashboard" />);

    expect(screen.getByText("Create an account")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByLabelText("Confirm Password")).toBeDefined();

    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeDefined();
  });

  test("renders errors", () => {
    render(<RegisterForm returnUrl="/dashboard" error="Invalid credentials" />);

    expect(screen.getByText("Invalid credentials")).toBeDefined();
  });
});
