/**
 * Feature: portfolio-platform, Property 19: SEO metadata generation
 *
 * Validates: Requirements 1.4
 *
 * Property: For any page with content data, the metadata generation function
 * SHALL produce output containing og:title, og:description, og:image, and og:url
 * fields with non-empty values derived from the page content.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generateMetadata, PageContent } from "../../src/utils/metadata";

describe("Property 19: SEO metadata generation", () => {
  it("should produce non-empty og:title, og:description, og:image, og:url for any page content", () => {
    const pageContentArb: fc.Arbitrary<PageContent> = fc.record({
      title: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
      description: fc
        .string({ minLength: 1 })
        .filter((s) => s.trim().length > 0),
      image: fc.option(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        { nil: undefined },
      ),
      url: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
    });

    fc.assert(
      fc.property(pageContentArb, (content) => {
        const result = generateMetadata(content);

        // All og: fields must be non-empty strings
        expect(result.openGraph["og:title"]).toBeTruthy();
        expect(result.openGraph["og:title"].length).toBeGreaterThan(0);

        expect(result.openGraph["og:description"]).toBeTruthy();
        expect(result.openGraph["og:description"].length).toBeGreaterThan(0);

        expect(result.openGraph["og:image"]).toBeTruthy();
        expect(result.openGraph["og:image"].length).toBeGreaterThan(0);

        expect(result.openGraph["og:url"]).toBeTruthy();
        expect(result.openGraph["og:url"].length).toBeGreaterThan(0);

        // Values should be derived from page content
        expect(result.openGraph["og:title"]).toContain(content.title.trim());
        expect(result.openGraph["og:url"]).toContain(content.url.trim());
      }),
      { numRuns: 100 },
    );
  });

  it("should produce non-empty og fields even when optional image is missing", () => {
    const pageContentWithoutImage: fc.Arbitrary<PageContent> = fc.record({
      title: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
      description: fc
        .string({ minLength: 1 })
        .filter((s) => s.trim().length > 0),
      image: fc.constant(undefined),
      url: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
    });

    fc.assert(
      fc.property(pageContentWithoutImage, (content) => {
        const result = generateMetadata(content);

        // og:image should still be non-empty (uses default)
        expect(result.openGraph["og:image"]).toBeTruthy();
        expect(result.openGraph["og:image"].length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });
});
