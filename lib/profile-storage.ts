"use client";

import type { ProfileState } from "./types";
import { createEmptyProfile, parseProfile } from "./profile";

const KEY = "agora:profile";

export function getProfile(): ProfileState {
  if (typeof window === "undefined") return createEmptyProfile();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? parseProfile(JSON.parse(raw)) : createEmptyProfile();
  } catch {
    return createEmptyProfile();
  }
}

export function saveProfile(profile: ProfileState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(parseProfile(profile)));
}
