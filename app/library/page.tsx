import PerspectiveCard from "@/components/PerspectiveCard";
import { perspectives, traditions } from "@/lib/perspectives";

export default function LibraryPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-14 pb-24">
      <h1 className="font-serif text-3xl mb-2">The Philosophy Library</h1>
      <p className="text-foreground-muted mb-10 max-w-xl">
        {perspectives.length} traditions and lenses, spanning Western,
        Eastern, contemporary, and scientific approaches to the human
        condition. Pick one to explore on its own terms.
      </p>

      {traditions.map((tradition) => (
        <div key={tradition} className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-4">
            {tradition}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perspectives
              .filter((p) => p.tradition === tradition)
              .map((p) => (
                <PerspectiveCard key={p.slug} perspective={p} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
