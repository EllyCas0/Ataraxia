// Data for the interactive "Schools of Thought" map: five major schools and how
// they relate. `School` is also the payload handed to the map's onSelect callback.

export type LinkKind = "affinity" | "tension";

export interface SchoolConnection {
  id: string;
  name: string;
  kind: LinkKind;
  label: string;
  note: string;
}

export interface Thinker {
  name: string;
  slug?: string; // set when the thinker has a profile page in this app
}

export interface School {
  id: string;
  name: string;
  era: string;
  region: string;
  tagline: string;
  summary: string;
  keyIdeas: string[];
  thinkers: Thinker[];
  hue: number; // node color, in HSL degrees
  position: { x: number; y: number }; // resting position in map units, centered on 0,0
  connections: SchoolConnection[];
}

type SchoolBase = Omit<School, "connections">;

interface SchoolLink {
  a: string;
  b: string;
  kind: LinkKind;
  label: string;
  note: string;
}

const base: SchoolBase[] = [
  {
    id: "stoicism",
    name: "Stoicism",
    era: "c. 300 BCE – 200 CE",
    region: "Greece and Rome",
    tagline: "Find freedom in what is up to you.",
    summary:
      "Stoics held that we can't control events, only our judgments and choices. Peace and a good life come from cultivating virtue, seeing situations clearly, and accepting what lies beyond our control.",
    keyIdeas: [
      "The dichotomy of control: separate what is up to you from what is not",
      "Virtue is the only true good",
      "Emotions follow our judgments, so examine the judgments",
      "Live in agreement with reason and nature",
    ],
    thinkers: [{ name: "Epictetus", slug: "epictetus" }, { name: "Seneca" }, { name: "Marcus Aurelius" }, { name: "Zeno of Citium" }],
    hue: 205,
    position: { x: -190, y: -70 },
  },
  {
    id: "buddhism",
    name: "Buddhism",
    era: "c. 5th century BCE onward",
    region: "South Asia, then across Asia",
    tagline: "Suffering comes from clinging; see clearly and loosen your grip.",
    summary:
      "Buddhist philosophy starts from the fact of suffering and traces it to craving and the belief in a fixed, separate self. Its answer is a practical path of ethics, attention, and insight rather than a set of doctrines to simply believe.",
    keyIdeas: [
      "The Four Noble Truths: suffering, its cause, its end, and the path",
      "Impermanence: everything is in flux",
      "Non-self: the sense of a fixed 'I' deserves examination",
      "The Middle Way between indulgence and denial",
    ],
    thinkers: [{ name: "Siddhartha Gautama (the Buddha)", slug: "buddha" }, { name: "Nagarjuna", slug: "nagarjuna" }],
    hue: 38,
    position: { x: -40, y: -190 },
  },
  {
    id: "confucianism",
    name: "Confucianism",
    era: "c. 500 BCE onward",
    region: "China, then East Asia",
    tagline: "Become fully human through relationships and practice.",
    summary:
      "Confucian thought treats a good life as a social achievement. Through study, ritual, and fulfilling reciprocal roles in family and community, people cultivate benevolence and help build a harmonious society.",
    keyIdeas: [
      "Ren: humaneness and care for others",
      "Li: ritual and propriety that give relationships shape",
      "Reciprocal duties within family, community, and state",
      "Lifelong self-cultivation through learning",
    ],
    thinkers: [{ name: "Confucius", slug: "confucius" }, { name: "Mencius" }, { name: "Xunzi", slug: "xunzi" }],
    hue: 140,
    position: { x: -120, y: 150 },
  },
  {
    id: "existentialism",
    name: "Existentialism",
    era: "19th–20th century",
    region: "Europe",
    tagline: "Existence comes first; you make your own meaning.",
    summary:
      "Existentialists begin from lived experience rather than abstract systems. With no pre-given purpose, each person is free, and therefore responsible, for choosing how to live, and for facing anxiety and absurdity honestly.",
    keyIdeas: [
      "Existence precedes essence",
      "Radical freedom and responsibility",
      "Authenticity versus living by default or in 'bad faith'",
      "Facing absurdity and anxiety without false comfort",
    ],
    thinkers: [{ name: "Friedrich Nietzsche (a major precursor)", slug: "nietzsche" }, { name: "Simone de Beauvoir", slug: "beauvoir" }, { name: "Jean-Paul Sartre" }, { name: "Albert Camus" }],
    hue: 285,
    position: { x: 210, y: -50 },
  },
  {
    id: "utilitarianism",
    name: "Utilitarianism",
    era: "Late 18th century onward",
    region: "Britain, then worldwide",
    tagline: "Do what brings the most well-being to everyone affected.",
    summary:
      "Utilitarians judge actions by their consequences for overall well-being, counting everyone's happiness equally. The approach shapes modern debates about public policy, animal welfare, and global giving.",
    keyIdeas: [
      "The greatest happiness principle",
      "Impartiality: everyone's well-being counts equally",
      "Outcomes matter more than intentions or tradition",
      "Act and rule versions of the theory",
    ],
    thinkers: [{ name: "Jeremy Bentham" }, { name: "John Stuart Mill", slug: "mill" }, { name: "Peter Singer" }],
    hue: 14,
    position: { x: 130, y: 130 },
  },
];

const links: SchoolLink[] = [
  { a: "stoicism", b: "buddhism", kind: "affinity", label: "Equanimity", note: "Both train the mind to meet loss and desire without being ruled by them." },
  { a: "stoicism", b: "confucianism", kind: "affinity", label: "Virtue as practice", note: "Both treat character as something built through daily discipline and the good fulfillment of one's roles." },
  { a: "stoicism", b: "utilitarianism", kind: "affinity", label: "Wide moral concern", note: "Stoic cosmopolitanism and utilitarian impartiality both push concern past one's own circle." },
  { a: "stoicism", b: "existentialism", kind: "tension", label: "Accept vs. create", note: "Stoics seek harmony with a rational order; existentialists deny any given order and stress self-made meaning." },
  { a: "buddhism", b: "utilitarianism", kind: "affinity", label: "Reducing suffering", note: "Both put the reduction of suffering at the center, one through the mind, the other through outcomes." },
  { a: "buddhism", b: "existentialism", kind: "tension", label: "The question of self", note: "Both face impermanence head-on, but Buddhism questions a fixed self while existentialism makes the self's choices central." },
  { a: "buddhism", b: "confucianism", kind: "tension", label: "Renunciation vs. family", note: "A long-running debate in China: monastic renunciation set against duties to family and society." },
  { a: "confucianism", b: "utilitarianism", kind: "tension", label: "Roles vs. impartiality", note: "Confucian ethics starts from particular bonds; utilitarianism asks you to weigh everyone's welfare equally." },
  { a: "existentialism", b: "utilitarianism", kind: "tension", label: "Authenticity vs. calculation", note: "Existentialists warn against hiding behind rules or calculations instead of owning your choice." },
];

function connectionsFor(id: string): SchoolConnection[] {
  return links.flatMap((link) => {
    const otherId = link.a === id ? link.b : link.b === id ? link.a : null;
    const other = otherId ? base.find((school) => school.id === otherId) : undefined;
    return other ? [{ id: other.id, name: other.name, kind: link.kind, label: link.label, note: link.note }] : [];
  });
}

export const schools: School[] = base.map((school) => ({ ...school, connections: connectionsFor(school.id) }));

export function getSchool(id: string): School | undefined {
  return schools.find((school) => school.id === id);
}
