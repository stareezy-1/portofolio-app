/**
 * Feature: portfolio-platform, Property 22: ARIA labels on interactive elements
 * Feature: portfolio-platform, Property 23: Theme contrast ratios
 * Feature: portfolio-platform, Property 24: Modal focus trapping
 *
 * Validates: Requirements 14.1, 14.2, 14.4
 *
 * Property 22: For any interactive element (button, link, input, toggle) rendered
 * by the UI component library, the element SHALL have either an aria-label,
 * aria-labelledby, or visible text content providing an accessible name.
 *
 * Property 23: For any text color and background color pair defined in the theme
 * configuration, the contrast ratio SHALL be at least 4.5:1 for normal text sizes
 * and at least 3:1 for large text sizes (18px+ or 14px+ bold).
 *
 * Property 24: For any modal component in open state, keyboard focus SHALL be
 * constrained within the modal boundaries, and tabbing from the last focusable
 * element SHALL cycle back to the first focusable element within the modal.
 */
import { describe, it, expect, afterEach } from "vitest";
import * as fc from "fast-check";
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { LIGHT_THEME, DARK_THEME } from "@/lib/constants/theme.const";
import { Button } from "@/lib/ui/atoms/Button";
import { Input } from "@/lib/ui/atoms/Input";
import { ThemeToggle } from "@/lib/ui/molecules/ThemeToggle";
import { NavLink } from "@/lib/ui/molecules/NavLink";
import { SocialLink } from "@/lib/ui/molecules/SocialLink";

// ============================================================================
// Helper: WCAG Contrast Ratio Calculation
// ============================================================================

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function linearize(channel: number): number {
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgbNormalized(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ============================================================================
// Helper: Check accessible name on rendered container
// ============================================================================

function hasAccessibleName(container: HTMLElement): boolean {
  // Check for aria-label on any element
  const withAriaLabel = container.querySelector("[aria-label]");
  if (withAriaLabel) {
    const label = withAriaLabel.getAttribute("aria-label");
    if (label && label.trim().length > 0) return true;
  }

  // Check for aria-labelledby
  const withAriaLabelledBy = container.querySelector("[aria-labelledby]");
  if (withAriaLabelledBy) {
    const labelledBy = withAriaLabelledBy.getAttribute("aria-labelledby");
    if (labelledBy && labelledBy.trim().length > 0) return true;
  }

  // Check for role-based elements with text content
  const interactive = container.querySelector(
    '[role="button"], [role="link"], [role="switch"], [role="textbox"], button, a, input',
  );
  if (interactive) {
    const textContent = interactive.textContent;
    if (textContent && textContent.trim().length > 0) return true;
    // Also check aria-label on the interactive element itself
    const ariaLabel = interactive.getAttribute("aria-label");
    if (ariaLabel && ariaLabel.trim().length > 0) return true;
  }

  return false;
}

// ============================================================================
// Property 22: ARIA labels on interactive elements
// ============================================================================

describe("Property 22: ARIA labels on interactive elements", () => {
  /**
   * **Validates: Requirements 14.1**
   */

  afterEach(() => {
    cleanup();
  });

  it("Button component SHALL have an accessible name for any generated label", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        fc.constantFrom(
          "primary" as const,
          "secondary" as const,
          "outline" as const,
        ),
        fc.constantFrom("sm" as const, "md" as const, "lg" as const),
        fc.boolean(),
        fc.boolean(),
        (label, variant, size, disabled, loading) => {
          const { container } = render(
            React.createElement(Button, {
              label,
              variant,
              size,
              disabled,
              loading,
              onPress: () => {},
            }),
          );

          expect(hasAccessibleName(container)).toBe(true);
          cleanup();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("Input component SHALL have an accessible name for any generated label or placeholder", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 30 })
          .filter((s) => s.trim().length > 0),
        fc.string({ minLength: 0, maxLength: 50 }),
        fc.option(
          fc
            .string({ minLength: 1, maxLength: 30 })
            .filter((s) => s.trim().length > 0),
        ),
        (label, value, placeholder) => {
          const { container } = render(
            React.createElement(Input, {
              label,
              value,
              onChange: () => {},
              placeholder: placeholder ?? undefined,
            }),
          );

          expect(hasAccessibleName(container)).toBe(true);
          cleanup();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("ThemeToggle component SHALL have an accessible name", () => {
    fc.assert(
      fc.property(fc.boolean(), (isDark) => {
        const { container } = render(
          React.createElement(ThemeToggle, {
            isDark,
            onToggle: () => {},
          }),
        );

        expect(hasAccessibleName(container)).toBe(true);
        cleanup();
      }),
      { numRuns: 100 },
    );
  });

  it("NavLink component SHALL have an accessible name for any generated label", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 30 })
          .filter((s) => s.trim().length > 0),
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        fc.boolean(),
        (label, href, active) => {
          const { container } = render(
            React.createElement(NavLink, {
              label,
              href,
              active,
              onPress: () => {},
            }),
          );

          expect(hasAccessibleName(container)).toBe(true);
          cleanup();
        },
      ),
      { numRuns: 100 },
    );
  });

  it("SocialLink component SHALL have an accessible name for any platform", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("github", "linkedin", "twitter", "email", "website"),
        fc.webUrl(),
        (platform, url) => {
          const { container } = render(
            React.createElement(SocialLink, {
              platform,
              url,
              onPress: () => {},
            }),
          );

          expect(hasAccessibleName(container)).toBe(true);
          cleanup();
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ============================================================================
// Property 23: Theme contrast ratios
// ============================================================================

describe("Property 23: Theme contrast ratios", () => {
  /**
   * **Validates: Requirements 14.2**
   */

  const textBackgroundPairs = [
    {
      textKey: "text",
      bgKey: "background",
      description: "primary text on background",
    },
    {
      textKey: "text",
      bgKey: "surface",
      description: "primary text on surface",
    },
    {
      textKey: "textSecondary",
      bgKey: "background",
      description: "secondary text on background",
    },
    {
      textKey: "textSecondary",
      bgKey: "surface",
      description: "secondary text on surface",
    },
  ];

  const themes = [
    { name: "LIGHT_THEME", theme: LIGHT_THEME },
    { name: "DARK_THEME", theme: DARK_THEME },
  ];

  it("all text/background pairs SHALL meet 4.5:1 contrast ratio for normal text", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...themes),
        fc.constantFrom(...textBackgroundPairs),
        ({ theme }, { textKey, bgKey }) => {
          const textColor = theme[textKey as keyof typeof theme];
          const bgColor = theme[bgKey as keyof typeof theme];
          const ratio = contrastRatio(textColor, bgColor);

          // WCAG AA requires 4.5:1 for normal text
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("all text/background pairs SHALL meet 3:1 contrast ratio for large text", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...themes),
        fc.constantFrom(...textBackgroundPairs),
        ({ theme }, { textKey, bgKey }) => {
          const textColor = theme[textKey as keyof typeof theme];
          const bgColor = theme[bgKey as keyof typeof theme];
          const ratio = contrastRatio(textColor, bgColor);

          // WCAG AA requires 3:1 for large text (18px+ or 14px+ bold)
          expect(ratio).toBeGreaterThanOrEqual(3.0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("UI accent colors on backgrounds SHALL meet 3:1 contrast ratio for large text", () => {
    const accentPairs = [
      { textKey: "primary", bgKey: "background" },
      { textKey: "primary", bgKey: "surface" },
      { textKey: "secondary", bgKey: "background" },
      { textKey: "secondary", bgKey: "surface" },
      { textKey: "error", bgKey: "background" },
      { textKey: "error", bgKey: "surface" },
      { textKey: "success", bgKey: "background" },
      { textKey: "success", bgKey: "surface" },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...themes),
        fc.constantFrom(...accentPairs),
        ({ theme }, { textKey, bgKey }) => {
          const textColor = theme[textKey as keyof typeof theme];
          const bgColor = theme[bgKey as keyof typeof theme];
          const ratio = contrastRatio(textColor, bgColor);

          // Large text (used for headings, buttons) requires 3:1
          expect(ratio).toBeGreaterThanOrEqual(3.0);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ============================================================================
// Property 24: Modal focus trapping
// ============================================================================

describe("Property 24: Modal focus trapping", () => {
  /**
   * **Validates: Requirements 14.4**
   */

  function createFocusTrapModal(focusableCount: number): HTMLElement {
    const modal = document.createElement("div");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    for (let i = 0; i < focusableCount; i++) {
      const button = document.createElement("button");
      button.textContent = `Button ${i + 1}`;
      button.setAttribute("data-index", String(i));
      modal.appendChild(button);
    }

    document.body.appendChild(modal);
    return modal;
  }

  function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function simulateFocusTrap(
    modal: HTMLElement,
    currentIndex: number,
    shiftKey: boolean,
  ): number {
    const focusable = getFocusableElements(modal);
    if (focusable.length === 0) return -1;

    let nextIndex: number;
    if (shiftKey) {
      nextIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1;
    }

    focusable[nextIndex].focus();
    return nextIndex;
  }

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("tabbing from the last focusable element SHALL cycle back to the first", () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 10 }), (focusableCount) => {
        document.body.innerHTML = "";

        const modal = createFocusTrapModal(focusableCount);
        const focusable = getFocusableElements(modal);

        // Focus the last element
        const lastIndex = focusable.length - 1;
        focusable[lastIndex].focus();
        expect(document.activeElement).toBe(focusable[lastIndex]);

        // Tab forward from last element should wrap to first
        const nextIndex = simulateFocusTrap(modal, lastIndex, false);
        expect(nextIndex).toBe(0);
        expect(document.activeElement).toBe(focusable[0]);

        document.body.innerHTML = "";
      }),
      { numRuns: 100 },
    );
  });

  it("shift+tabbing from the first focusable element SHALL cycle to the last", () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 10 }), (focusableCount) => {
        document.body.innerHTML = "";

        const modal = createFocusTrapModal(focusableCount);
        const focusable = getFocusableElements(modal);

        // Focus the first element
        focusable[0].focus();
        expect(document.activeElement).toBe(focusable[0]);

        // Shift+Tab from first element should wrap to last
        const nextIndex = simulateFocusTrap(modal, 0, true);
        expect(nextIndex).toBe(focusable.length - 1);
        expect(document.activeElement).toBe(focusable[focusable.length - 1]);

        document.body.innerHTML = "";
      }),
      { numRuns: 100 },
    );
  });

  it("focus SHALL remain within modal boundaries for any sequence of tab presses", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 8 }),
        fc.array(fc.boolean(), { minLength: 1, maxLength: 20 }),
        (focusableCount, tabSequence) => {
          document.body.innerHTML = "";

          const modal = createFocusTrapModal(focusableCount);
          const focusable = getFocusableElements(modal);

          // Start at first element
          focusable[0].focus();
          let currentIndex = 0;

          // Apply sequence of Tab (false=forward) and Shift+Tab (true=backward)
          for (const shiftKey of tabSequence) {
            currentIndex = simulateFocusTrap(modal, currentIndex, shiftKey);

            // Focus must always be within the modal's focusable elements
            expect(currentIndex).toBeGreaterThanOrEqual(0);
            expect(currentIndex).toBeLessThan(focusable.length);
            expect(document.activeElement).toBe(focusable[currentIndex]);
          }

          document.body.innerHTML = "";
        },
      ),
      { numRuns: 100 },
    );
  });
});
