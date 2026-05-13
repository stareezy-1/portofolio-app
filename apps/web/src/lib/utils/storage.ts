const TOKEN_KEY = "portfolio_auth_token";
const THEME_KEY = "portfolio_theme";

function getStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // localStorage may throw in some environments (e.g., Safari private mode)
  }
  return null;
}

export function getStoredToken(): string | null {
  try {
    const storage = getStorage();
    return storage?.getItem(TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    const storage = getStorage();
    storage?.setItem(TOKEN_KEY, token);
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function clearStoredToken(): void {
  try {
    const storage = getStorage();
    storage?.removeItem(TOKEN_KEY);
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function getStoredTheme(): string | null {
  try {
    const storage = getStorage();
    return storage?.getItem(THEME_KEY) ?? null;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: string): void {
  try {
    const storage = getStorage();
    storage?.setItem(THEME_KEY, theme);
  } catch {
    // Silently fail if storage is unavailable
  }
}
