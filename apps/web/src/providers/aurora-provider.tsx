"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { aurora, type AuroraTokens } from "@/lib/constants/aurora";

export interface IAuroraContext {
  tokens: AuroraTokens;
  reducedMotion: boolean;
}

const AuroraContext = createContext<IAuroraContext>({
  tokens: aurora,
  reducedMotion: false,
});

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Web
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    // React Native
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { AccessibilityInfo } = require("react-native") as {
        AccessibilityInfo: {
          isReduceMotionEnabled?: () => Promise<boolean>;
        };
      };
      AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
        if (enabled) setReduced(true);
      });
    } catch {
      // not in RN environment
    }
    return undefined;
  }, []);

  return reduced;
}

export function AuroraAppProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  const value = useMemo<IAuroraContext>(
    () => ({ tokens: aurora, reducedMotion }),
    [reducedMotion],
  );

  return (
    <AuroraContext.Provider value={value}>{children}</AuroraContext.Provider>
  );
}

export function useAurora(): IAuroraContext {
  return useContext(AuroraContext);
}
