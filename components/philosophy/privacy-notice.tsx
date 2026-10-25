import { Lock } from "lucide-react";

export function PrivacyNotice() {
  return (
    <aside aria-label="Privacy" className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
      <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p>
        <span className="font-medium text-foreground">Your journal and saved items stay in this browser.</span> They are not synced between devices or tied to an account. Anyone using this browser profile can access them, and clearing site data removes them.
        Values and conversation history are previews. When live chat is available, messages are sent to an AI provider to write replies.
      </p>
    </aside>
  );
}
