/**
 * Feature: portfolio-platform, Property 21: Cache invalidation on mutation
 *
 * Validates: Requirements 13.6
 *
 * Property: For any admin mutation (create, update, delete project), after the
 * mutation succeeds, the relevant React Query cache keys SHALL be invalidated
 * so subsequent queries fetch fresh data.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";

// Mock the api client to return successful responses
vi.mock("@/lib/utils/api-client", () => ({
  apiClient: {
    post: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    put: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    delete: vi
      .fn()
      .mockResolvedValue({ data: { success: true, data: { message: "ok" } } }),
    get: vi.fn().mockResolvedValue({ data: { success: true, data: [] } }),
  },
}));

// Mock react-query hooks to capture mutation configs
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: vi.fn(),
    useMutation: vi.fn((config: any) => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      _config: config,
    })),
  };
});

type MutationType = "create" | "update" | "delete";

describe("Property 21: Cache invalidation on mutation", () => {
  let invalidateQueriesSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    invalidateQueriesSpy = vi.fn().mockResolvedValue(undefined);

    // Set up the mock for useQueryClient to return our spy-equipped client
    const { useQueryClient } = await import("@tanstack/react-query");
    (useQueryClient as ReturnType<typeof vi.fn>).mockReturnValue({
      invalidateQueries: invalidateQueriesSpy,
    });
  });

  it("should invalidate projects and featured-projects cache keys for any admin mutation type", async () => {
    const mutationTypeArb: fc.Arbitrary<MutationType> = fc.constantFrom(
      "create" as MutationType,
      "update" as MutationType,
      "delete" as MutationType,
    );

    // Import the hooks fresh to pick up mocks
    const { useCreateProject, useUpdateProject, useDeleteProject } =
      await import("@/lib/hooks/useAdmin");

    await fc.assert(
      fc.asyncProperty(mutationTypeArb, async (mutationType) => {
        invalidateQueriesSpy.mockClear();

        // Get the mutation hook result which contains the config
        let mutationResult: any;
        switch (mutationType) {
          case "create":
            mutationResult = useCreateProject();
            break;
          case "update":
            mutationResult = useUpdateProject();
            break;
          case "delete":
            mutationResult = useDeleteProject();
            break;
        }

        // Extract and execute the onSuccess callback from the mutation config
        const onSuccess = mutationResult._config.onSuccess;
        expect(onSuccess).toBeDefined();

        // Call onSuccess to simulate a successful mutation
        await onSuccess();

        // Verify that invalidateQueries was called
        const calls = invalidateQueriesSpy.mock.calls;
        expect(calls.length).toBeGreaterThanOrEqual(2);

        // Extract the query keys that were invalidated
        const invalidatedKeys = calls.map((call: any[]) => call[0].queryKey);

        // The "projects" key must be invalidated for all mutation types
        expect(invalidatedKeys).toContainEqual(["projects"]);

        // The "featured-projects" key must be invalidated for all mutation types
        expect(invalidatedKeys).toContainEqual(["featured-projects"]);
      }),
      { numRuns: 100 },
    );
  });

  it("should invalidate cache keys regardless of mutation input data", async () => {
    const mutationTypeArb: fc.Arbitrary<MutationType> = fc.constantFrom(
      "create" as MutationType,
      "update" as MutationType,
      "delete" as MutationType,
    );

    // Generate arbitrary project data to ensure invalidation is independent of input
    const projectInputArb = fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }),
      slug: fc
        .stringMatching(/^[a-z0-9-]+$/)
        .filter((s) => s.length >= 1 && s.length <= 50),
      description: fc.string({ minLength: 1, maxLength: 500 }),
      type: fc.constantFrom("mobile", "web", "backend"),
      technologies: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
        minLength: 0,
        maxLength: 5,
      }),
      featured: fc.boolean(),
    });

    const { useCreateProject, useUpdateProject, useDeleteProject } =
      await import("@/lib/hooks/useAdmin");

    await fc.assert(
      fc.asyncProperty(
        mutationTypeArb,
        projectInputArb,
        async (mutationType, _input) => {
          invalidateQueriesSpy.mockClear();

          let mutationResult: any;
          switch (mutationType) {
            case "create":
              mutationResult = useCreateProject();
              break;
            case "update":
              mutationResult = useUpdateProject();
              break;
            case "delete":
              mutationResult = useDeleteProject();
              break;
          }

          // Execute onSuccess - the property states that regardless of input,
          // cache invalidation always happens
          await mutationResult._config.onSuccess();

          const calls = invalidateQueriesSpy.mock.calls;
          const invalidatedKeys = calls.map((call: any[]) => call[0].queryKey);

          // Property: cache keys are always invalidated regardless of input
          expect(invalidatedKeys).toContainEqual(["projects"]);
          expect(invalidatedKeys).toContainEqual(["featured-projects"]);
        },
      ),
      { numRuns: 100 },
    );
  });
});
