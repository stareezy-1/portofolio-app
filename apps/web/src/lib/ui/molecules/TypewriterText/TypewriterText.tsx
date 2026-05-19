"use client";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useAurora } from "@/providers/aurora-provider";
import { styles } from "./TypewriterText.style";

export interface TypewriterTextProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  style?: object;
}

export function TypewriterText({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
  style,
}: TypewriterTextProps) {
  const { reducedMotion } = useAurora();
  const [displayed, setDisplayed] = useState(phrases[0] ?? "");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(phrases[0]?.length ?? 0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(phrases[phraseIdx % phrases.length] ?? "");
      return;
    }

    const current = phrases[phraseIdx % phrases.length] ?? "";

    if (!isDeleting && charIdx < current.length) {
      const t = setTimeout(() => {
        setCharIdx((c) => c + 1);
        setDisplayed(current.slice(0, charIdx + 1));
      }, typingSpeed);
      return () => clearTimeout(t);
    }

    if (!isDeleting && charIdx === current.length) {
      const t = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIdx > 0) {
      const t = setTimeout(() => {
        setCharIdx((c) => c - 1);
        setDisplayed(current.slice(0, charIdx - 1));
      }, deletingSpeed);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }
  }, [
    charIdx,
    isDeleting,
    phraseIdx,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    reducedMotion,
  ]);

  return (
    <Text style={[styles.text, style]}>
      {displayed}
      <Text style={styles.cursor}>|</Text>
    </Text>
  );
}
