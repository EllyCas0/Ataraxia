import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Message text is plain text. React escapes it, and it is split on blank lines into paragraphs.
// Nothing is rendered as HTML, so neither user nor model output can inject markup.
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((paragraph, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {paragraph}
        </p>
      ))}
    </>
  );
}

export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] space-y-3 rounded-2xl rounded-br-md bg-secondary px-4 py-3 text-base leading-relaxed md:max-w-[75%]">
        <Paragraphs text={content} />
      </div>
    </div>
  );
}

export function AssistantMessage({
  content,
  streaming = false,
  onSaveInsight,
  className,
}: {
  content: string;
  streaming?: boolean;
  onSaveInsight?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("border-l-2 border-primary/30 pl-4 md:pl-5", className)}>
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Stoa</span>
        <Badge variant="outline">AI-generated</Badge>
      </div>
      <div className="space-y-3 font-serif text-lg leading-[1.7]" aria-busy={streaming}>
        <Paragraphs text={content} />
      </div>
      {onSaveInsight && !streaming && (
        <Button type="button" variant="ghost" size="sm" className="mt-2 -ml-2 text-muted-foreground" onClick={onSaveInsight}>
          <Bookmark data-icon="inline-start" aria-hidden />
          Save insight
        </Button>
      )}
    </div>
  );
}
