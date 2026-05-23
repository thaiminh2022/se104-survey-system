import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/auth/login-form";

describe("login form", () => {
  test("renders login field", () => {
    render(<LoginForm returnUrl="/dashboard" />);

    expect(screen.getByText("Login to your account")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
  });

  test("renders errors", () => {
    render(
      <LoginForm
        returnUrl="/dashboard"
        error="Invalid credentials"
        message="Please login first"
      />,
    );

    expect(screen.getByText("Invalid credentials")).toBeDefined();
    expect(screen.getByText("Please login first")).toBeDefined();
  });
});
