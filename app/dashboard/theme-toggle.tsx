"use client";

import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="lg" disabled>
        Theme
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <IconSun /> : <IconMoon />}
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
