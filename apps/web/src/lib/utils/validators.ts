/** Validates an email address format. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Validates a URL-friendly slug (lowercase letters, numbers, hyphens). */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/** Validates a URL string. */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/** Validates a file size in bytes against a max in MB. */
export function isWithinSizeLimit(sizeBytes: number, maxMB: number): boolean {
  return sizeBytes <= maxMB * 1024 * 1024;
}

/** Validates a MIME type against an allowed list. */
export function isAllowedFileType(
  mimeType: string,
  allowed: string[],
): boolean {
  return allowed.includes(mimeType);
}

/** Validates that a string is non-empty after trimming. */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/** Validates that a string meets a minimum length. */
export function meetsMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/** Validates that a string does not exceed a maximum length. */
export function meetsMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

/** Returns field-level validation errors for a project create/update input. */
export function validateProjectInput(input: {
  title?: string;
  slug?: string;
  description?: string;
  type?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.title || !isNonEmpty(input.title)) {
    errors.title = "Title is required";
  }
  if (!input.slug || !isNonEmpty(input.slug)) {
    errors.slug = "Slug is required";
  } else if (!isValidSlug(input.slug)) {
    errors.slug =
      "Slug must contain only lowercase letters, numbers, and hyphens";
  }
  if (!input.description || !isNonEmpty(input.description)) {
    errors.description = "Description is required";
  }
  if (!input.type || !isNonEmpty(input.type)) {
    errors.type = "Type is required";
  } else if (!["mobile", "web", "backend"].includes(input.type)) {
    errors.type = "Type must be one of: mobile, web, backend";
  }

  return errors;
}
