import type { IProject } from "../types/project";
import type { IProjectCreateInput } from "../types/api";
import { EProjectType } from "../constants/enums";
import {
  MAX_IMAGE_SIZE_MB,
  ALLOWED_FILE_TYPES,
} from "../constants/upload.const";

/**
 * Validates an email address against the pattern ^[^\s@]+@[^\s@]+\.[^\s@]+$
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Trims leading/trailing whitespace and collapses internal whitespace to single spaces.
 * Idempotent: sanitizeFormField(sanitizeFormField(s)) === sanitizeFormField(s)
 */
export function sanitizeFormField(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Filters projects by type AND search query (AND logic).
 * - type "all" matches all projects
 * - search is case-insensitive, matches title or description
 * - empty search matches all projects
 * Idempotent and metamorphic: result.length <= projects.length
 */
export function filterProjects(
  projects: IProject[],
  type: EProjectType | "all",
  search: string,
): IProject[] {
  const normalizedSearch = search.trim().toLowerCase();
  return projects.filter((p) => {
    const typeMatch = type === "all" || p.type === type;
    const searchMatch =
      normalizedSearch === "" ||
      p.title.toLowerCase().includes(normalizedSearch) ||
      p.description.toLowerCase().includes(normalizedSearch);
    return typeMatch && searchMatch;
  });
}

/**
 * Truncates text to at most maxLength characters.
 * If text.length <= maxLength, returns text unchanged.
 */
export function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Sorts work experience entries in reverse chronological order.
 * Entries with no endDate (current/active) come first.
 * Then sorted by startDate descending.
 */
export function sortTimelineEntries<
  T extends { startDate: string; endDate?: string },
>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    // Active entries (no endDate) come first
    if (!a.endDate && b.endDate) return -1;
    if (a.endDate && !b.endDate) return 1;
    // Both active or both ended — sort by startDate descending
    return b.startDate.localeCompare(a.startDate);
  });
}

/**
 * Returns up to 2 related projects of the same type, excluding the current project.
 */
export function getRelatedProjects(
  current: IProject,
  allProjects: IProject[],
): IProject[] {
  return allProjects
    .filter((p) => p.id !== current.id && p.type === current.type)
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Legacy validators — kept for backward compatibility with utils/index.ts
// ---------------------------------------------------------------------------

/** Returns true if the string is a valid URL-friendly slug (lowercase, hyphens, alphanumeric). */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/** Returns true if the string is a valid absolute URL (http or https). */
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns true if the file size (in bytes) is within the allowed limit (MB). */
export function isWithinSizeLimit(
  sizeBytes: number,
  maxMb: number = MAX_IMAGE_SIZE_MB,
): boolean {
  return sizeBytes <= maxMb * 1024 * 1024;
}

/** Returns true if the file MIME type is in the allowed list. */
export function isAllowedFileType(
  mimeType: string,
  allowed: string[] = ALLOWED_FILE_TYPES,
): boolean {
  return allowed.includes(mimeType);
}

/** Returns true if the string is non-empty after trimming. */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/** Returns true if the string meets the minimum length after trimming. */
export function meetsMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/** Returns true if the string does not exceed the maximum length. */
export function meetsMaxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/** Validates a project create input, returning an error message or null. */
export function validateProjectInput(
  input: Partial<IProjectCreateInput>,
): string | null {
  if (!input.title || !isNonEmpty(input.title)) return "Title is required.";
  if (!input.slug || !isValidSlug(input.slug))
    return "Slug must be lowercase alphanumeric with hyphens.";
  if (!input.description || !isNonEmpty(input.description))
    return "Description is required.";
  if (!input.type) return "Project type is required.";
  if (input.githubUrl && !isValidUrl(input.githubUrl))
    return "GitHub URL must be a valid URL.";
  if (input.liveUrl && !isValidUrl(input.liveUrl))
    return "Live URL must be a valid URL.";
  return null;
}
