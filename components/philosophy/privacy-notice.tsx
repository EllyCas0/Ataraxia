import { Lock } from "lucide-react";

export function PrivacyNotice() {
  return (
    <aside aria-label="Privacy" className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
      <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p>
        <span className="font-medium text-foreground">This space is private to you.</span> Your journal, saved insights, values, and conversations are tied to your account and are never shown publicly.
        When you chat, your messages are sent to an AI provider to write replies. You can delete any entry or conversation, or your whole account, at any time.
      </p>
    </aside>
  );
}
