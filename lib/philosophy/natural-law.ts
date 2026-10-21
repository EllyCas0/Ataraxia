import type { CriticalPerspective, PhilosophySource, PhilosophyTenet, PhilosophyThinker, TraditionBundle } from "./types";

// Natural Law, as an introductory module. All of this is plain data: the pages and components read it
// through registry.ts and never mention Natural Law by name, so another tradition can be added the same way.
//
// EDITORIAL NOTE. The ten tenets are a synthesized framework written for this app. They are NOT an official
// list that every natural law philosopher accepts, and the philosophers disagree with each other about much
// of it. Each tenet carries a status ("classical", "interpretation", or "contested") and, where Aquinas's own
// view differs from the wider framework, an `aquinasNote`. These texts are drafts for an expert to review
// before launch (see docs/ARCHITECTURE.md). Quotations are avoided where wording varies between
// translations; passages are cited so they can be checked.

const T = "natural-law";

export const naturalLawSources: PhilosophySource[] = [
  {
    id: "s-aristotle-ne",
    author: "Aristotle",
    title: "Nicomachean Ethics",
    sourceType: "primary",
    notes: "Book I (the human good and the function argument), II (virtue), III (voluntary action), V.7 (natural and legal justice), VI (practical wisdom).",
  },
  { id: "s-aristotle-pol", author: "Aristotle", title: "Politics", sourceType: "primary", notes: "Book I.2 (the human being as a political animal) and I.4–6 (the argument about 'natural slaves')." },
  { id: "s-plato-rep", author: "Plato", title: "Republic", sourceType: "primary", notes: "Book IV, an early account of the four 'cardinal' virtues." },
  {
    id: "s-cicero-rep",
    author: "Cicero",
    title: "De Re Publica (On the Republic)",
    sourceType: "primary",
    notes: "Book 3.33, preserved in a quotation by Lactantius: the passage on a true law in agreement with nature and reason.",
  },
  {
    id: "s-diogenes",
    author: "Diogenes Laërtius",
    title: "Lives of Eminent Philosophers",
    sourceType: "primary",
    notes: "Book 7, sections 87–89: a later report of the Stoic aim of living 'in agreement with nature'.",
  },
  {
    id: "s-augustine",
    author: "Augustine of Hippo",
    title: "On Free Choice of the Will",
    sourceType: "primary",
    notes: "Book 1, chapter 5: the remark that an unjust law seems to be no law at all, later quoted by Aquinas.",
  },
  {
    id: "s-aquinas-q1",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Questions 1–5 (the last end and happiness)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2001.htm",
    notes: "Question 1 on the last end; Question 3 article 8 places perfect happiness in the vision of God.",
  },
  {
    id: "s-aquinas-q6",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Questions 6–21 (voluntary action and the morality of acts)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2006.htm",
    notes: "Question 6 is the start of his account of the voluntary and the involuntary.",
  },
  {
    id: "s-aquinas-q90",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Question 90 (the essence of law)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2090.htm",
    notes: "Article 1: law as an ordinance of reason. Article 2: law is directed to the common good.",
  },
  {
    id: "s-aquinas-q91",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Question 91 (the kinds of law)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2091.htm",
    notes: "Article 2: natural law as the rational creature's participation in the eternal law.",
  },
  {
    id: "s-aquinas-q94",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Question 94 (the natural law)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2094.htm",
    notes: "Article 2: the first precept and the natural inclinations. Article 3: acts of virtue. Article 4: how far the precepts are the same for everyone.",
  },
  {
    id: "s-aquinas-q95",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Question 95 (human law)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2095.htm",
    notes: "Article 2: a human law that departs from the natural law is a 'perversion of law'.",
  },
  {
    id: "s-aquinas-q96",
    author: "Thomas Aquinas",
    title: "Summa Theologiae I-II, Question 96 (the power of human law)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/2096.htm",
    notes: "Article 4: when an unjust law does and does not bind in conscience.",
  },
  {
    id: "s-aquinas-q57",
    author: "Thomas Aquinas",
    title: "Summa Theologiae II-II, Question 57 (right)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/3057.htm",
    notes: "On 'natural right' (ius naturale) and positive right.",
  },
  {
    id: "s-aquinas-q58",
    author: "Thomas Aquinas",
    title: "Summa Theologiae II-II, Question 58 (justice)",
    sourceType: "primary",
    url: "https://www.newadvent.org/summa/3058.htm",
    notes: "Article 1: justice as a steady will to give each their due.",
  },
  {
    id: "s-grotius",
    author: "Hugo Grotius",
    title: "De Jure Belli ac Pacis (On the Law of War and Peace)",
    sourceType: "primary",
    notes: "Prolegomena, section 11: the remark that natural law would hold even if God did not exist.",
  },
  {
    id: "s-locke",
    author: "John Locke",
    title: "Second Treatise of Government (1689)",
    sourceType: "primary",
    url: "https://www.gutenberg.org/ebooks/7370",
    notes: "Chapter 2 on the state of nature and the law of nature (especially section 6).",
  },
  { id: "s-hume", author: "David Hume", title: "A Treatise of Human Nature", sourceType: "primary", notes: "Book 2, part 3, section 3 (reason and the passions) and Book 3, part 1, section 1 (the is–ought passage)." },
  { id: "s-mill-nature", author: "John Stuart Mill", title: "Nature, in Three Essays on Religion (1874)", sourceType: "primary", notes: "An essay arguing that 'natural' and 'good' are different things." },
  { id: "s-mill-liberty", author: "John Stuart Mill", title: "On Liberty (1859)", sourceType: "primary", notes: "The 'harm principle' and the worry about the majority restricting individual freedom." },
  {
    id: "s-sophocles",
    author: "Sophocles",
    title: "Antigone",
    sourceType: "primary",
    notes: "A play (c. 441 BCE), often cited as an image of conflict between a ruler's decree and a higher duty. It is literature, not a statement of a theory.",
  },
  {
    id: "s-mlk",
    author: "Martin Luther King Jr.",
    title: "Letter from Birmingham Jail (1963)",
    sourceType: "primary",
    notes: "Cites Aquinas and Augustine in arguing that an unjust law is not rooted in eternal law and natural law.",
  },
  {
    id: "s-radbruch",
    author: "Gustav Radbruch",
    title: "Statutory Lawlessness and Supra-Statutory Law (1946)",
    sourceType: "primary",
    notes: "The 'Radbruch formula': statutes that are intolerably unjust lose their status as law.",
  },
  {
    id: "s-hart",
    author: "H. L. A. Hart",
    title: "Positivism and the Separation of Law and Morals, Harvard Law Review 71 (1958)",
    sourceType: "secondary",
    notes: "The classic statement of legal positivism's reply to natural law, and the first half of the Hart–Fuller debate.",
  },
  {
    id: "s-fuller",
    author: "Lon L. Fuller",
    title: "Positivism and Fidelity to Law: A Reply to Professor Hart, Harvard Law Review 71 (1958)",
    sourceType: "secondary",
    notes: "Fuller's reply, arguing that law has an 'inner morality'.",
  },
  {
    id: "s-finnis",
    author: "John Finnis",
    title: "Natural Law and Natural Rights (Oxford University Press, 1980; 2nd edition 2011)",
    sourceType: "secondary",
    notes: "A modern restatement: basic goods, the requirements of practical reasonableness, and the common good.",
  },
  {
    id: "s-foot",
    author: "Philippa Foot",
    title: "Natural Goodness (Oxford University Press, 2001)",
    sourceType: "secondary",
    notes: "A neo-Aristotelian reply to the is–ought objection.",
  },
  {
    id: "s-sep",
    author: "Mark Murphy",
    title: "Natural Law Theories, Stanford Encyclopedia of Philosophy",
    sourceType: "secondary",
    url: "https://plato.stanford.edu/entries/natural-law-theories/",
    notes: "A careful, free overview by a specialist; a good next step after this module.",
  },
];

export const naturalLawThinkers: PhilosophyThinker[] = [
  {
    id: "aristotle",
    name: "Aristotle",
    years: "384–322 BCE",
    role: "Greek philosopher",
    contribution:
      "Distinguished what is just by nature from what is just only by convention, and grounded ethics in human flourishing and virtue. He did not teach a 'natural law' in the later sense, but his ethics is the foundation that later natural law thinking built on.",
    sourceIds: ["s-aristotle-ne", "s-aristotle-pol"],
  },
  {
    id: "stoics",
    name: "The Stoics",
    years: "from about 300 BCE",
    role: "Greek and Roman school, including Zeno of Citium and Chrysippus",
    contribution:
      "Taught that the universe is ordered by reason and that living well means living in agreement with nature, including our own rational nature. Their picture of one law shared by all rational beings strongly shaped later natural law ideas.",
    sourceIds: ["s-diogenes"],
  },
  {
    id: "cicero",
    name: "Cicero",
    years: "106–43 BCE",
    role: "Roman statesman and writer",
    contribution:
      "Passed Stoic ideas on to Rome. In On the Republic (3.33) he describes a true law, in agreement with nature and reason, that is the same for all peoples and times and that no legislature may cancel.",
    sourceIds: ["s-cicero-rep"],
  },
  {
    id: "aquinas",
    name: "Thomas Aquinas",
    years: "1225–1274",
    role: "Italian Dominican friar and theologian",
    contribution:
      "Gave natural law its most influential systematic form in the Summa Theologiae (I-II, Questions 90–97). He distinguishes eternal, natural, human, and divine law, and argues that human laws must be measured against the natural law.",
    sourceIds: ["s-aquinas-q90", "s-aquinas-q91", "s-aquinas-q94", "s-aquinas-q95"],
  },
  {
    id: "locke",
    name: "John Locke",
    years: "1632–1704",
    role: "English philosopher",
    contribution:
      "Turned natural law toward individual rights. In the Second Treatise he argues that people in a state of nature are already bound by a law of nature, which gives everyone claims to life, liberty, and possessions that governments exist to protect.",
    sourceIds: ["s-locke"],
  },
  {
    id: "finnis",
    name: "John Finnis",
    years: "born 1940",
    role: "Australian legal philosopher",
    contribution:
      "Revived natural law theory with Natural Law and Natural Rights (1980). He argues for a set of basic goods grasped by practical reason, and says they are not derived from claims about human nature, as a reply to the is–ought objection. He worked closely with Germain Grisez on what is called the 'new natural law' theory.",
    sourceIds: ["s-finnis"],
  },
];

export const naturalLawTenets: PhilosophyTenet[] = [
  {
    id: "nl-1-objective-morality",
    traditionId: T,
    number: 1,
    title: "Objective Morality",
    definition: "Some moral truths may exist independently of individual preferences or cultural conventions.",
    explanation:
      "Natural Law theorists hold that some things are right or wrong whether or not anyone approves of them or the law says so. On this view morality is something we discover by thinking carefully, a bit like mathematics, rather than something we simply invent or vote on. Most natural law thinkers add that these truths are open to ordinary reason, so people in any culture could in principle recognise them. The claim is about some moral truths: the tradition does not say that every moral question has one obvious answer.",
    status: "classical",
    origins: [
      "Aristotle (Nicomachean Ethics V.7) distinguishes what is just 'by nature', which has the same force everywhere, from what is just only by convention. Scholars debate how fixed he thought this was.",
      "The Stoics and Cicero describe a universal law grounded in reason that binds everyone, whatever their city's laws say.",
      "Aquinas (Summa Theologiae I-II, Q94 a4) argues that the most general principles are the same for everyone, while more specific conclusions can vary or be mistaken.",
    ],
    aquinasNote:
      "For Aquinas, natural law is the part of God's eternal law that rational creatures can grasp by reason (I-II Q91 a2). Many modern natural law thinkers keep the idea of objective moral truths but argue for it without appealing to God.",
    example:
      "A society votes that one group of people has no rights, and most people approve. Someone who says 'this is still wrong' is making the kind of claim this tenet describes: that the rightness of an act does not depend on how many people accept it.",
    reflectionQuestion: "Can you think of something that would still be wrong even if everyone you know approved of it? What makes you confident, or what makes you hesitate?",
    relatedConceptIds: ["categorical-imperative", "is-ought-gap"],
    relatedThinkerIds: ["aristotle", "cicero", "aquinas"],
    criticisms: [
      "Moral relativists point to deep disagreement between cultures and eras and ask why we should think there is one right answer.",
      "Critics ask how we could know such truths exist: unlike scientific claims, they cannot be tested by experiment.",
      "Defenders reply that disagreement does not show there is no truth (people also disagreed about astronomy), but the debate is unresolved.",
    ],
    sourceIds: ["s-aristotle-ne", "s-cicero-rep", "s-aquinas-q91", "s-aquinas-q94"],
  },
  {
    id: "nl-2-human-nature",
    traditionId: T,
    number: 2,
    title: "Human Nature",
    definition: "Understanding human capacities, needs, and characteristics can inform ethical reasoning.",
    explanation:
      "Natural Law starts from the idea that humans are a particular kind of being with particular capacities: we reason, we live in communities, we depend on each other, we seek knowledge. Knowing what something is helps in knowing what it is for it to do well, just as knowing what a knife is for tells you what makes a good knife. The tradition suggests that ethics should fit the kind of beings we are, not be a set of arbitrary rules imposed from outside. The hard part is saying exactly what human nature includes, and how much it settles.",
    status: "classical",
    origins: [
      "Aristotle's 'function argument' (Nicomachean Ethics I.7) reasons that a good human life is one in which our distinctive capacity, reason, is exercised well.",
      "The Stoics taught that living well means living 'in agreement with nature', including our rational nature (reported by Diogenes Laërtius, 7.87).",
      "Aquinas (Summa Theologiae I-II, Q94 a2) links the precepts of natural law to our natural inclinations.",
    ],
    aquinasNote:
      "Aquinas names three layers of natural inclination: those we share with all living things (staying alive), those we share with animals (reproduction and raising young), and those specific to rational beings (seeking truth and living in society). He treats these as guides to what reason should value, not as automatic rules (I-II Q94 a2).",
    example:
      "People generally do badly when they are isolated for long periods, even if their physical needs are met. A natural law thinker would say this tells us something about what humans need in order to flourish, and so about why friendship and community matter morally and not only practically.",
    reflectionQuestion: "What do you think is most distinctive about being human? What would a good life look like if it took that seriously?",
    relatedConceptIds: ["eudaimonia", "existence-precedes-essence"],
    relatedThinkerIds: ["aristotle", "stoics", "aquinas"],
    criticisms: [
      "Humans vary enormously, and evolutionary biology describes populations changing over time. Critics ask whether there is a fixed 'human nature' that could ground ethics.",
      "Existentialists such as Sartre argue that humans have no fixed essence and must define themselves through choice.",
      "Critics also worry that claims about 'human nature' have often reflected the assumptions of the people making them (see Critical Perspectives).",
    ],
    sourceIds: ["s-aristotle-ne", "s-diogenes", "s-aquinas-q94", "s-sep"],
  },
  {
    id: "nl-3-practical-reason",
    traditionId: T,
    number: 3,
    title: "Practical Reason",
    definition: "Humans can use reason to evaluate actions, identify goods, and consider moral obligations.",
    explanation:
      "'Practical reason' means thinking about what to do, as opposed to thinking about what is true. Natural Law holds that this kind of thinking can be done well or badly, and that when it is done well it points toward real goods and away from real harms. It is not just working out the best way to get what we happen to want: it includes asking whether our wants are worth having. This is why natural law thinkers say that moral knowledge is open to ordinary people reasoning carefully, not only to experts or to those with special revelation.",
    status: "classical",
    origins: [
      "Aristotle (Nicomachean Ethics VI) describes practical wisdom (phronesis) as the ability to deliberate well about how to live.",
      "Aquinas (Summa Theologiae I-II, Q94 a2) says the first principle of practical reason is that good is to be done and pursued, and evil avoided, and that further precepts are built on it.",
      "Aquinas (I-II, Q90 a1) describes law as an ordinance of reason rather than of mere will.",
    ],
    aquinasNote:
      "Aquinas's 'first precept' is very general: it does not say what is good, only that practical reasoning aims at the good. The more specific precepts come from reflecting on the human goods (see Tenet 5).",
    example:
      "Deciding whether to tell a friend an uncomfortable truth. You weigh honesty, the friendship, the likely effects, and what you owe them. Natural Law says this deliberation can be better or worse, and can be improved by experience and careful thinking.",
    reflectionQuestion: "When you face a hard decision, how do you decide what is worth caring about, as distinct from how to get what you already want?",
    relatedConceptIds: ["golden-mean", "categorical-imperative"],
    relatedThinkerIds: ["aristotle", "aquinas"],
    criticisms: [
      "Hume argued that reason alone cannot move us to act: 'reason is, and ought only to be the slave of the passions' (Treatise 2.3.3). If so, reasoning cannot tell us which ends are worth pursuing.",
      "Critics say that people who reason carefully still reach very different conclusions, which makes the claim that reason delivers shared moral knowledge hard to defend.",
    ],
    sourceIds: ["s-aristotle-ne", "s-aquinas-q90", "s-aquinas-q94", "s-hume"],
  },
  {
    id: "nl-4-human-flourishing",
    traditionId: T,
    number: 4,
    title: "Human Flourishing",
    definition: "Ethical living involves pursuing conditions that enable individuals to live well.",
    explanation:
      "Flourishing (in Greek, eudaimonia) means more than feeling good. It means living a full, well-functioning human life: developing your abilities, having good relationships, and doing worthwhile things. Natural Law ties right action to flourishing: actions are good when they support a person's and a community's ability to live well, and bad when they undermine it. Because flourishing is about a whole life, it concerns what kind of person you become, not only single choices.",
    status: "classical",
    origins: [
      "Aristotle (Nicomachean Ethics I) argues that every action aims at some good and that the highest good is eudaimonia, a life of activity in accord with virtue.",
      "Aquinas adopts and reshapes this: he argues that complete human happiness cannot be found in this life (Summa Theologiae I-II, Q1–5).",
    ],
    aquinasNote:
      "For Aquinas, perfect happiness is ultimately union with God, which goes beyond anything natural reason alone could establish (I-II Q3 a8). Secular natural law theorists usually keep the idea of flourishing but leave out this theological step.",
    example:
      "A person with plenty of money who spends all their time on work they find meaningless, and has lost touch with their friends. Flourishing asks whether their life is going well, not only whether they have what they wanted.",
    reflectionQuestion: "If you looked back on your life, what would have to be true for you to say it went well? Does that match how you spend your time now?",
    relatedConceptIds: ["eudaimonia", "experience-machine"],
    relatedThinkerIds: ["aristotle", "aquinas"],
    criticisms: [
      "People disagree about what flourishing is. Critics worry that a theory of the good life can be used to pressure people into one way of living.",
      "Critics ask whether flourishing is too vague to guide decisions, and whether it is really about morality or just about self-fulfilment.",
    ],
    sourceIds: ["s-aristotle-ne", "s-aquinas-q1", "s-sep"],
  },
  {
    id: "nl-5-basic-human-goods",
    traditionId: T,
    number: 5,
    title: "Basic Human Goods",
    definition: "Life, knowledge, social relationships, and rational conduct are central goods in many Natural Law theories.",
    explanation:
      "Natural Law theorists name a small set of goods that are worth pursuing for their own sake and not just as a means to something else. The lists differ. A common core is: life and health; knowledge and understanding; friendship and community; and practical reasonableness, meaning living by good reasoning rather than impulse. The idea is that these goods are 'basic': we do not justify them by pointing to something further, and a good life includes a share in each. They can conflict, and the tradition says that practical reason has to decide what to do when they do.",
    status: "interpretation",
    origins: [
      "Aquinas (Summa Theologiae I-II, Q94 a2) ties the precepts of natural law to three layers of inclination: preserving life, family life and raising children, and (for rational beings) seeking truth and living in society.",
      "The modern 'new natural law' theorist John Finnis (Natural Law and Natural Rights, 1980) argues for seven basic goods: life, knowledge, play, aesthetic experience, sociability or friendship, practical reasonableness, and religion.",
      "The four goods on this card are a simplified synthesis of these lists, not a quotation from either.",
    ],
    aquinasNote:
      "Aquinas does not give a list of 'basic goods' in the modern sense. The closest passage is his account of natural inclinations (Q94 a2). The idea of a list of irreducible basic goods is mainly associated with Finnis and Germain Grisez.",
    example:
      "A hospital must decide how to use scarce resources. A natural law thinker might say that life and health matter, but so do the patient's understanding of their situation (knowledge), their relationships, and their ability to take part in decisions, so a good decision pays attention to more than survival.",
    reflectionQuestion: "Which of these goods would you find hardest to give up? Is there anything that matters to you that does not fit on this list?",
    relatedConceptIds: ["experience-machine", "ubuntu"],
    relatedThinkerIds: ["aquinas", "finnis"],
    criticisms: [
      "Critics ask who decides which goods are on the list, and whether the lists reflect one culture's assumptions.",
      "If goods cannot be ranked against each other (they are 'incommensurable'), it is unclear how to decide when they conflict.",
      "Some argue that the list is not really derived from human nature but chosen to fit conclusions its authors already hold.",
    ],
    sourceIds: ["s-aquinas-q94", "s-finnis", "s-sep"],
  },
  {
    id: "nl-6-justice",
    traditionId: T,
    number: 6,
    title: "Justice",
    definition: "Ethical conduct requires considering fairness, rights, responsibilities, and what people are owed.",
    explanation:
      "In the classical tradition, justice is about giving people what they are owed, and it is the part of ethics that concerns how we treat others, not just our own character. Natural Law treats justice as having a basis in nature and not only in custom: some things are owed to people because of what they are, whether or not a law says so. Classical writers also distinguish kinds of justice: fairness in exchanges, fair sharing of common goods, and fairness in correcting wrongs. The details are debated, but the thought that people have claims on us that no law created is central.",
    status: "classical",
    origins: [
      "Aristotle (Nicomachean Ethics V.7) distinguishes 'natural' justice from 'legal' justice, which is what is just by convention.",
      "Roman law, and then Aquinas (Summa Theologiae II-II, Q57–58), define justice as a steady will to give each person their due.",
      "Locke (Second Treatise, ch. 2) develops the idea that people have natural rights to life, liberty, and possessions before any government exists.",
    ],
    aquinasNote:
      "Aquinas treats justice as a virtue concerned with what is due to others (II-II Q58 a1) and discusses 'natural right' (ius naturale) in II-II Q57. Natural rights as individual entitlements in the modern sense are more characteristic of Locke than of Aquinas.",
    example:
      "An employer pays two people different wages for the same work, for a reason that has nothing to do with their work. Even if the law allows it, many people sense that something is owed to the underpaid worker. That sense is what this tenet tries to explain.",
    reflectionQuestion: "Think of a time something was legal but felt unfair, or fair but not legal. What was the 'something more' you were appealing to?",
    relatedConceptIds: ["veil-of-ignorance", "categorical-imperative"],
    relatedThinkerIds: ["aristotle", "aquinas", "locke"],
    criticisms: [
      "Different theories of justice give different answers about what people are owed (equal shares, deserved rewards, or meeting needs, for example). Natural law alone does not decide between them.",
      "Some critics argue that talk of 'natural' rights has been used to protect existing privileges, such as property, as if nature had fixed them.",
    ],
    sourceIds: ["s-aristotle-ne", "s-aquinas-q57", "s-aquinas-q58", "s-locke"],
  },
  {
    id: "nl-7-common-good",
    traditionId: T,
    number: 7,
    title: "The Common Good",
    definition: "Social institutions and collective arrangements should support conditions that enable people to flourish.",
    explanation:
      "The common good is not simply the total of everyone's private interests. In this tradition it means the shared conditions, such as safety, fair institutions, education, a healthy environment, and a culture of trust, that make it possible for everyone to pursue a good life. Laws and institutions are judged by whether they serve those conditions. This tenet can pull against individual freedom, because someone may want to act in a way that makes the shared conditions worse. Natural Law thinkers disagree about how far authorities may go to protect the common good.",
    status: "classical",
    origins: [
      "Aristotle (Politics I.2) argues that humans are by nature political animals and that the city exists for the sake of living well, not just surviving.",
      "Aquinas (Summa Theologiae I-II, Q90 a2) says that law must be directed to the common good.",
      "Later writers, including Catholic social teaching and Finnis, developed 'the common good' further.",
    ],
    aquinasNote:
      "Aquinas holds that law is directed to the common good (Q90 a2) and that it is made by those who have care of the community (Q90 a3). He does not endorse any particular modern political system.",
    example:
      "A town builds a public water system that no single household could afford and that serves everyone better than private wells. Many natural law thinkers would cite this as the kind of shared condition the tenet has in mind. Whether, and how far, the town may require people to pay for it is where the debate begins.",
    reflectionQuestion: "What shared conditions do you depend on every day without noticing? When should they take priority over what an individual wants?",
    relatedConceptIds: ["ubuntu", "veil-of-ignorance"],
    relatedThinkerIds: ["aristotle", "aquinas", "finnis"],
    criticisms: [
      "Liberals such as Mill warn that appeals to the common good can be used to justify restricting individual freedom in the name of the majority or the state (On Liberty).",
      "Critics ask who decides what the common good requires, and whether the idea is too vague to constrain the powerful.",
    ],
    sourceIds: ["s-aristotle-pol", "s-aquinas-q90", "s-finnis", "s-mill-liberty"],
  },
  {
    id: "nl-8-virtue",
    traditionId: T,
    number: 8,
    title: "Virtue",
    definition: "Character traits such as justice, courage, temperance, and practical wisdom contribute to ethical living.",
    explanation:
      "Virtues are stable character traits that help a person act well: courage in facing danger, temperance in handling pleasure, justice in dealing with others, and practical wisdom in judging what to do. Natural Law connects virtue to human nature: these traits count as virtues because they help human beings flourish. Rules alone are not enough, because applying them takes judgment and good habits. A person of good character tends to see what matters in a situation and respond well to it.",
    status: "classical",
    origins: [
      "Aristotle (Nicomachean Ethics II) describes virtues as settled habits of choice that find the mean between extremes.",
      "Plato (Republic IV) and later writers named the four 'cardinal' virtues: wisdom or prudence, justice, courage, and temperance. Aquinas builds on them.",
      "Aquinas (Summa Theologiae I-II, Q94 a3) argues that, in one respect, all virtuous acts fall under the natural law because reason directs us to them.",
    ],
    aquinasNote:
      "Aquinas says that virtuous acts as such belong to the natural law (Q94 a3), but he also distinguishes the natural law's general direction toward virtue from the specific details, which human law and practical judgment must work out.",
    example:
      "Someone is asked to cover for a colleague's mistake. A rule such as 'do not lie' helps, but what the situation calls for also depends on courage (speaking up), fairness to everyone involved, and practical wisdom about how and when to do it.",
    reflectionQuestion: "Which virtue do you find hardest to practise? Is it because you do not know what to do, or because you find it hard to do it?",
    relatedConceptIds: ["golden-mean", "eudaimonia"],
    relatedThinkerIds: ["aristotle", "aquinas"],
    criticisms: [
      "Some psychologists argue that behaviour depends far more on circumstances than on stable character traits, which challenges the idea that virtues are reliable.",
      "Critics ask which traits count as virtues and who decides: lists of virtues vary across cultures and periods.",
      "Some argue that virtue ethics gives weak guidance about what to do in a specific dilemma.",
    ],
    sourceIds: ["s-aristotle-ne", "s-plato-rep", "s-aquinas-q94"],
  },
  {
    id: "nl-9-moral-responsibility",
    traditionId: T,
    number: 9,
    title: "Moral Responsibility",
    definition: "Freedom and decision-making involve responsibilities toward oneself and others.",
    explanation:
      "Natural Law assumes that people can choose, and that choice matters morally. If you act freely and knowingly, you are accountable for what you do and for what you could reasonably have foreseen. Responsibility has limits: people are less to blame when they act under compulsion, or through ignorance they could not help. The tradition also stresses responsibilities toward ourselves, such as developing our abilities and not wasting our lives, as well as toward others and the community.",
    status: "interpretation",
    origins: [
      "Aristotle (Nicomachean Ethics III) analyses when actions are 'voluntary' and when force or ignorance excuses us.",
      "Aquinas (Summa Theologiae I-II, Q6–21) gives a detailed account of voluntary action, intention, and the moral character of choices.",
      "This tenet is a synthesis: the classical authors treat responsibility as part of their wider ethics rather than as a separate principle of natural law.",
    ],
    aquinasNote:
      "Aquinas develops the analysis of voluntary action at length (I-II Q6–21), and his discussion of self-defence in II-II Q64 a7 is the source of the 'principle of double effect'. He does not present responsibility as one of the precepts of the natural law.",
    example:
      "Someone drives while very tired and causes an accident. They did not intend harm, but they chose to drive knowing the risk. Responsibility asks what they knew, what they chose, and what they could have done differently.",
    reflectionQuestion: "Where do you draw the line between what someone is responsible for and what was beyond their control? Does the line move when the person is you?",
    relatedConceptIds: ["situated-freedom", "bad-faith"],
    relatedThinkerIds: ["aristotle", "aquinas"],
    criticisms: [
      "Determinists argue that if our choices are fully caused by earlier events, then responsibility in the strong sense is an illusion.",
      "Others argue that social conditions shape people's choices so strongly that individual blame is often misplaced.",
    ],
    sourceIds: ["s-aristotle-ne", "s-aquinas-q6", "s-sep"],
  },
  {
    id: "nl-10-limits-of-authority",
    traditionId: T,
    number: 10,
    title: "Moral Limits of Authority",
    definition: "Legal validity and social acceptance do not automatically establish moral legitimacy.",
    explanation:
      "If morality is not just whatever authorities or society say, then a law can be valid (properly made and enforced) and still be morally wrong. Natural Law thinkers use this idea to explain why people can be right to criticise unjust laws, and sometimes to resist them. This is the most disputed part of the tradition. Some natural law thinkers say that a gravely unjust law is not truly law at all. Others, including legal positivists, say it is clearer to say that it is law but morally wrong, which keeps the question 'is it law?' separate from 'should I obey it?'.",
    status: "contested",
    origins: [
      "Sophocles' play Antigone (c. 441 BCE) is often cited: Antigone defies the king's decree to follow what she sees as a higher duty to bury her brother. It is a drama, not a theory.",
      "Augustine (On Free Choice of the Will 1.5) wrote that an unjust law seems to be no law at all. Aquinas (Summa Theologiae I-II, Q95 a2) develops this, saying that a human law that departs from the natural law is a 'perversion of law'.",
      "After the Second World War, the German legal philosopher Gustav Radbruch (1946) argued that statutes that are intolerably unjust lose their status as law.",
    ],
    aquinasNote:
      "Aquinas says an unjust human law is not truly law but a 'perversion of law' (Q95 a2). He adds that it may not bind in conscience, except where disobeying would cause scandal or disorder (Q96 a4), so he does not give a blanket right to disobey.",
    example:
      "Under a regime, a law requires citizens to report neighbours who shelter refugees. The law is properly enacted and enforced. Natural Law gives one way to say that someone could be morally right to refuse, even though they are breaking a valid law. Martin Luther King Jr. cited Aquinas in this way in his 'Letter from Birmingham Jail' (1963).",
    reflectionQuestion: "When, if ever, is it right to break a law? What would have to be true about the law, and about how you break it?",
    relatedConceptIds: ["categorical-imperative", "veil-of-ignorance"],
    relatedThinkerIds: ["aquinas", "cicero", "locke"],
    criticisms: [
      "Legal positivists such as H. L. A. Hart argue that whether something is law and whether it is morally good are separate questions, and that blurring them makes bad laws harder to criticise clearly (Hart, 1958).",
      "Lon Fuller replied that law has an 'inner morality' (clarity, consistency, publicity), so that legal systems cannot be completely separated from morality.",
      "Critics also point out that people on every side of a disagreement claim a 'higher law' for their view, so appeals to natural law can justify disobedience for bad reasons as well as good ones.",
    ],
    sourceIds: ["s-aquinas-q95", "s-aquinas-q96", "s-augustine", "s-radbruch", "s-hart", "s-fuller", "s-mlk", "s-sophocles"],
  },
];

export const naturalLawPerspectives: CriticalPerspective[] = [
  {
    id: "is-ought",
    kind: "criticism",
    title: "The is–ought problem",
    summary: "Facts about human nature do not, by themselves, tell us how we ought to live.",
    detail:
      "Hume observed that writers often slide from statements about what is to statements about what ought to be without explaining the step (Treatise, Book 3, part 1, section 1). Critics say Natural Law does this when it moves from facts about human nature to claims about right and wrong. Responses: (1) Aquinas and Finnis say the basic goods are grasped directly by practical reason, not deduced from facts about nature, so no illegitimate step occurs. (2) Neo-Aristotelians such as Philippa Foot argue that judging a living thing to be a good or bad example of its kind is a legitimate way to connect facts and values. (3) Critics reply that this only relocates the problem: why should the goods we grasp, or the 'good specimen' standard, bind us? The question remains open.",
    sourceIds: ["s-hume", "s-finnis", "s-foot"],
  },
  {
    id: "appeal-to-nature",
    kind: "criticism",
    title: "'Natural' does not mean 'good'",
    summary: "Nature contains much that we would call cruel, so what is natural cannot simply be what is right.",
    detail:
      "John Stuart Mill argued in his essay 'Nature' (1874) that if we judged by nature we would have to approve of much that people condemn, since nature is full of killing and suffering. Natural law theorists answer that they are not saying that whatever happens naturally is good. They appeal to our rational nature: what careful reasoning shows to be fulfilling for beings like us. Critics reply that the word 'natural' still invites slippage, for instance when behaviour is called 'unnatural' as a way of condemning it without giving an argument.",
    sourceIds: ["s-mill-nature", "s-sep"],
  },
  {
    id: "cultural-bias",
    kind: "criticism",
    title: "Cultural and historical bias",
    summary: "Appeals to 'nature' have often reflected the assumptions of the people making them.",
    detail:
      "Throughout history, claims about what is 'natural' have been used to defend things most people now reject. Aristotle argued in the Politics that some people are 'natural slaves', and claims about the 'natural' roles of women were used to deny them rights. Critics conclude that 'nature' can act as a mirror for a culture's assumptions. Defenders reply that these were mistakes in applying the theory, not flaws in it, and that natural law and natural rights reasoning was also used to criticise slavery and defend human rights. Critics respond that if the theory cannot reliably prevent such mistakes, its claim to objectivity is weakened. Both points deserve to be taken seriously.",
    sourceIds: ["s-aristotle-pol", "s-sep"],
  },
  {
    id: "legal-positivism",
    kind: "debate",
    title: "Law and morality: natural law versus legal positivism",
    summary: "Is a gravely unjust law still law? Philosophers of law disagree.",
    detail:
      "Legal positivists such as H. L. A. Hart hold that whether a rule is valid law depends on social facts (how it was made and accepted), not on whether it is just. In a famous 1958 exchange, Lon Fuller replied that law has an 'inner morality' and that a system with no connection to justice would not really be a legal system. Gustav Radbruch's 1946 formula, which says that intolerably unjust statutes are not law, was influential in German courts after the Nazi period. Positivists respond that it is clearer and safer to say such rules are law but morally wrong, so that people can see exactly what they are refusing to obey. This debate is alive in legal philosophy today.",
    sourceIds: ["s-hart", "s-fuller", "s-radbruch"],
  },
  {
    id: "religious-secular",
    kind: "debate",
    title: "Religious and secular versions",
    summary: "Should natural law rest on God, on reason alone, or on both?",
    detail:
      "For Aquinas, natural law is our share in God's eternal law (Summa Theologiae I-II, Q91 a2). In the seventeenth century Hugo Grotius remarked that natural law would still hold even if, impossibly, God did not exist, which helped open the way to secular versions. Modern thinkers such as Finnis present arguments that do not depend on religious premises, though Finnis himself counts religion among the basic goods. Critics of religious grounding say it gives no reason to non-believers to accept the law. Critics of secular versions ask what gives a law of reason its authority to bind us, if there is no lawgiver. Defenders on both sides think their version can answer.",
    sourceIds: ["s-aquinas-q91", "s-grotius", "s-finnis"],
  },
  {
    id: "freedom-common-good",
    kind: "debate",
    title: "Individual freedom and the common good",
    summary: "How far can a community act for shared goods before it restricts individual freedom too much?",
    detail:
      "Classical natural law stresses community, virtue, and the common good. Locke's version stresses individual rights and liberty against the state. Mill's harm principle (On Liberty) warns against restricting people for their own good or the majority's preference. Communitarian critics reply that individuals cannot flourish without shared institutions, which need protecting. Natural law thinkers often say that the common good includes the conditions of freedom, so the two are not simply opposed, but they disagree about where the limits lie. The question is a live one in debates about taxes, public health, speech, and education.",
    sourceIds: ["s-locke", "s-mill-liberty", "s-finnis"],
  },
  {
    id: "defence-unjust-laws",
    kind: "defence",
    title: "It explains how a law can be wrong",
    summary: "Natural Law gives a way to say that 'it is legal' does not end the moral argument.",
    detail:
      "Supporters argue that the tradition gives a clear account of why people can be right to criticise, and sometimes resist, laws that are properly enacted. They point to the Nuremberg trials after the Second World War and to the American civil rights movement, in which King appealed explicitly to Aquinas and Augustine. Critics note that other theories, such as utilitarianism and Kantian ethics, can also criticise unjust laws without natural law, so this argument does not by itself favour Natural Law over its rivals.",
    sourceIds: ["s-mlk", "s-aquinas-q95", "s-radbruch"],
  },
  {
    id: "defence-human-rights",
    kind: "defence",
    title: "It links to human rights and moral progress",
    summary: "The idea that people have rights no government grants has deep roots in natural law thinking.",
    detail:
      "Supporters point out that the idea of universal rights that no law can cancel grew out of natural law and natural rights thinking, including Locke's Second Treatise. They argue that moral progress, for example the rejection of slavery, makes most sense if some moral claims are true independently of what a society believes at a given time. Critics reply that rights can be defended without natural law, and that the historical link does not show the theory is true.",
    sourceIds: ["s-locke", "s-sep"],
  },
  {
    id: "defence-flourishing",
    kind: "defence",
    title: "It ties ethics to a good human life",
    summary: "Unlike a pure rulebook, Natural Law explains why morality matters for people's lives.",
    detail:
      "Supporters argue that by connecting right action to human flourishing, Natural Law answers the question 'why be moral?' better than theories that only list duties. It also treats character, relationships, and community as part of ethics and not as extras. Critics reply that other theories, especially virtue ethics and care ethics, share these strengths without needing a claim about a fixed human nature.",
    sourceIds: ["s-aristotle-ne", "s-finnis"],
  },
  {
    id: "defence-convergence",
    kind: "defence",
    title: "A wide overlap in basic values",
    summary: "Despite disagreements, many societies share a core of concerns.",
    detail:
      "Defenders point out that nearly every society has norms against gratuitous killing and betrayal and norms favouring care for children and keeping promises, and argue that this overlap is evidence for common human goods. Critics respond that such norms could be explained by what keeps societies going, without any objective morality, and that they are applied very differently in practice. The evidence is open to interpretation.",
    sourceIds: ["s-sep", "s-finnis"],
  },
];

export const naturalLawBundle: TraditionBundle = {
  tradition: {
    id: T,
    name: "Natural Law",
    category: "Ethics",
    summary: "The idea that some standards of right and wrong are grounded in human nature, reason, or the natural order, and not only in human decisions, customs, or laws.",
    centralQuestion: "Are there objective moral principles grounded in human nature, reason, or the natural order?",
    historicalContext:
      "Natural Law has been developed for more than two thousand years. Greek philosophers asked what is just by nature and what only by convention. The Stoics and Cicero spoke of a universal law of reason. In the Middle Ages, Aquinas built these ideas into a systematic theory of law and ethics. Early modern thinkers such as Grotius and Locke reshaped it into a theory of natural rights, and in the twentieth century it was debated in connection with the Nuremberg trials, the civil rights movement, and legal philosophy.",
    tenetIds: naturalLawTenets.map((tenet) => tenet.id),
    thinkerIds: ["aristotle", "stoics", "cicero", "aquinas", "locke", "finnis"],
  },
  overview: {
    definition:
      "Natural Law is the family of ideas holding that some standards of right and wrong are grounded in human nature, reason, or the natural order, rather than only in human decisions, customs, or laws. These standards, it is claimed, can be discovered by reasoning, and they give us a measure against which human laws and social practices can be judged.",
    frameworkNote:
      "The ten tenets in this module are a synthesized introductory framework written for this app. They are not an official list agreed by all natural law philosophers, who disagree with one another on many points. Each card is labelled to show whether an idea is a classical claim, a modern interpretation, or contested. Where Aquinas's own views differ from the wider framework, the card says so.",
    distinctions: [
      {
        term: "Natural law",
        meaning: "Moral principles said to be discoverable by reason and grounded in human nature or the natural order. It is about how we ought to act.",
        contrast: "It can be violated: people can and do act against it, and it is a standard for judging, not a description of what happens.",
      },
      {
        term: "Natural rights",
        meaning: "Moral claims that individuals are said to hold (such as life and liberty) independently of any government. In Locke's version they follow from the law of nature.",
        contrast: "Natural law is mainly about what is right to do, while natural rights are about what each person is owed. Modern rights language emphasises the individual more than classical natural law does.",
      },
      {
        term: "Positive law",
        meaning: "Law that human authorities have actually made: statutes, regulations, and court rulings. Whether it is valid depends on how it was made and recognised.",
        contrast: "Positive law describes what the law is. Natural law theorists say positive law can be judged morally, and that some of it can be unjust.",
      },
      {
        term: "Scientific laws of nature",
        meaning: "Descriptions of regularities in the physical world, such as gravity.",
        contrast: "They describe what always happens and cannot be broken. Natural law is a moral standard, not a physical one, and the shared word 'nature' is easy to confuse.",
      },
    ],
    timeline: [
      { period: "4th century BCE", who: "Aristotle", idea: "Separates what is just by nature from what is just by convention, and bases ethics on flourishing and virtue.", thinkerId: "aristotle" },
      { period: "from about 300 BCE", who: "The Stoics", idea: "Teach that reason orders the cosmos and that we should live in agreement with nature.", thinkerId: "stoics" },
      { period: "1st century BCE", who: "Cicero", idea: "Describes a true law of right reason, the same for all peoples and times.", thinkerId: "cicero" },
      { period: "13th century", who: "Aquinas", idea: "Systematises natural law as part of a theory of eternal, natural, human, and divine law.", thinkerId: "aquinas" },
      { period: "17th century", who: "Grotius and Locke", idea: "Develop secular and rights-based versions, with Locke's natural rights shaping modern political thought.", thinkerId: "locke" },
      { period: "20th century", who: "Radbruch, Hart, Fuller, Finnis", idea: "Debate whether unjust laws are law, and revive natural law with a theory of basic goods.", thinkerId: "finnis" },
    ],
  },
  tenets: naturalLawTenets,
  thinkers: naturalLawThinkers,
  perspectives: naturalLawPerspectives,
  sources: naturalLawSources,
};
