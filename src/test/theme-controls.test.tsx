import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeSwitcher } from "@/components/ipa/SiteChrome";
import { ThemeProvider } from "@/hooks/use-theme";

describe("theme controls", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("applies and saves the selected theme", async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Dark mode" }));

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Dark mode" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
      expect(document.documentElement).toHaveClass("dark");
      expect(localStorage.getItem("ipa-theme")).toBe("dark");
    });
  });
});
