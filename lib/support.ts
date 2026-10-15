// First-step monetization: a "support the project" payment link and a Pro
// waitlist. Both are configured through environment variables, so the repo
// holds no account details and nothing appears in the UI until a link is set.

export interface SupportLinks {
  donateUrl: string | null;
  waitlistUrl: string | null;
}

interface SupportEnv {
  donate?: string;
  waitlist?: string;
  waitlistEmail?: string;
}

// External links must be https; anything else (including javascript: URLs) is ignored.
function httpsUrl(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function waitlistMailto(email?: string): string | null {
  const address = email?.trim();
  if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return null;
  const subject = encodeURIComponent("The Agora Pro waitlist");
  const body = encodeURIComponent("Please add me to the Pro waitlist.");
  return `mailto:${address}?subject=${subject}&body=${body}`;
}

export function resolveSupportLinks(env: SupportEnv): SupportLinks {
  return {
    donateUrl: httpsUrl(env.donate),
    waitlistUrl: httpsUrl(env.waitlist) ?? waitlistMailto(env.waitlistEmail),
  };
}

// NEXT_PUBLIC_ variables must be referenced literally so Next.js can inline them at build time.
export const supportLinks = resolveSupportLinks({
  donate: process.env.NEXT_PUBLIC_SUPPORT_URL,
  waitlist: process.env.NEXT_PUBLIC_WAITLIST_URL,
  waitlistEmail: process.env.NEXT_PUBLIC_WAITLIST_EMAIL,
});

export const supportEnabled = Boolean(supportLinks.donateUrl || supportLinks.waitlistUrl);
