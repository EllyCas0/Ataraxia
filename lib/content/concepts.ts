import type { Concept } from "./types";

// Reading notes on well-known ideas, written for newcomers.
//
// IMPORTANT: these are drafts written for this app and have NOT been reviewed by a subject-matter
// expert. They are seeded as "approved" so the product works end to end in development, but they
// must be reviewed for accuracy before being presented to real users as authoritative.
// Source references name real works only, and deliberately omit page numbers and URLs that have not
// been checked. Add those during review.
type Seed = Omit<Concept, "publicationStatus" | "contentType">;

const seeds: Seed[] = [
  {
    slug: "dichotomy-of-control",
    title: "The dichotomy of control",
    tradition: "Stoicism",
    philosopher: "Epictetus",
    summary:
      "Epictetus taught that some things are up to us (our judgments, intentions, and choices) and others are not (our bodies, reputations, and outcomes). Peace and good action begin by sorting the two.",
    detailedExplanation:
      "In the opening of the Enchiridion, Epictetus separates what is in our power (opinion, impulse, desire, aversion) from what is not (body, property, reputation, public office). Stoics argued that much distress comes from treating what is not up to us as though it were. The practice is not passivity: Stoic ethics asks us to act as well as we can while holding outcomes more loosely. Popular versions often shrink this to a rule of thumb about controlling what you can, but the Stoic view is tied to a larger claim, that virtue rather than external success is what makes a life good, which many philosophers do not accept.",
    coreClaims: [
      "Our judgments and choices are within our power; outcomes and other people's reactions are not.",
      "Distress often comes from the judgments we attach to events, not only from the events themselves.",
      "A good life rests on acting well, not on securing particular results.",
    ],
    practicalApplication:
      "Before a stressful event, list what is yours to do (preparation, honesty, effort) and what is not (the verdict, someone else's reaction). Direct your effort to the first list.",
    counterarguments: [
      "The line between what is and is not up to us is blurry: effort, habits, and even judgment are shaped by circumstances and by other people.",
      "Critics worry that the framing can slide into resignation about injustices that could be changed collectively.",
      "It leans on the Stoic claim that virtue is enough for a good life, which is contested.",
    ],
    reflectionQuestion: "Think of something you are worried about right now. Which parts of it are genuinely yours to act on?",
    relatedConcepts: ["examined-life", "eudaimonia", "impermanence"],
    themes: ["freedom-responsibility", "meaning-purpose", "death-impermanence"],
    sourceReferences: [
      { kind: "primary", author: "Epictetus", title: "Enchiridion", location: "section 1" },
      { kind: "secondary", author: "A. A. Long", title: "Epictetus: A Stoic and Socratic Guide to Life", year: "2002" },
    ],
  },
  {
    slug: "examined-life",
    title: "The examined life",
    tradition: "Socratic inquiry",
    philosopher: "Socrates (as portrayed by Plato)",
    summary:
      "In Plato's Apology, Socrates says that an unexamined life is not worth living for a human being. Testing our beliefs and values through honest questioning is, on this view, central to living well.",
    detailedExplanation:
      "Socrates left no writings, so we know him mainly through Plato's dialogues, which is why scholars distinguish the historical Socrates from Plato's literary portrayal. In the dialogues he questions people about what they claim to know (courage, justice, piety) and often shows that their definitions do not hold up. In the Apology he presents this as a kind of service, and says his only wisdom is awareness of how little he knows. He also urges people to care for their souls, meaning their character, more than for wealth or reputation.",
    coreClaims: [
      "Beliefs about how to live should be tested through honest questioning.",
      "Recognizing what we do not know is a starting point for wisdom.",
      "Caring for one's character matters more than wealth or reputation.",
    ],
    practicalApplication:
      "When you feel strongly about something, ask what you mean by the key words, and what would count against your view, before you argue for it.",
    counterarguments: [
      "We know Socrates mainly through Plato, so how much of the 'Socratic method' belongs to the historical man is debated.",
      "Constant questioning can paralyze action or alienate others. Socrates was tried and executed in Athens in 399 BCE, and the reasons are still discussed.",
      "Some argue that reflection has to be balanced with tradition, practice, and trust, and that not everyone can or should live a perpetually examined life.",
    ],
    reflectionQuestion: "What is one belief you hold strongly but have never really tested?",
    relatedConcepts: ["dichotomy-of-control", "pragmatic-maxim", "allegory-of-the-cave"],
    themes: ["identity-self-knowledge", "knowledge-truth", "meaning-purpose"],
    sourceReferences: [
      { kind: "primary", author: "Plato", title: "Apology", location: "the passage on the examined life near the end of Socrates' speech after his conviction" },
      { kind: "secondary", author: "Gregory Vlastos", title: "Socrates: Ironist and Moral Philosopher", year: "1991" },
    ],
  },
  {
    slug: "eudaimonia",
    title: "Eudaimonia: flourishing",
    tradition: "Aristotelian virtue ethics",
    philosopher: "Aristotle",
    summary:
      "For Aristotle, the aim of human life is eudaimonia, often translated as flourishing: living and acting well over a whole life, in line with the virtues.",
    detailedExplanation:
      "In the Nicomachean Ethics, Aristotle asks what the highest human good is, and answers that it is an activity of the soul in accordance with virtue, over a complete life. He argues that virtues of character such as courage and generosity are developed through habit and practice, and guided by practical wisdom. Flourishing, for him, is not just a feeling: it also needs friends and a measure of good fortune. 'Happiness' is a common translation, but it can mislead because the word usually suggests a mood rather than a way of living.",
    coreClaims: [
      "The human good is an activity of the soul in accordance with virtue, across a whole life.",
      "Virtues of character are built through practice and guided by practical wisdom.",
      "A flourishing life depends on more than inner states, including friendship and some external goods.",
    ],
    practicalApplication:
      "Alongside 'what do I want?', ask 'what kind of person does this make me?' and 'is this part of a life I would call flourishing?'",
    counterarguments: [
      "Aristotle's argument from the characteristic function of a human being has been criticized as resting on a dated teleological view of nature.",
      "Some of his views, about women and slavery, for example, show the limits of his social position, which raises doubts about how universal his picture of flourishing is.",
      "Virtue ethics is sometimes said to give weak guidance in particular dilemmas.",
    ],
    reflectionQuestion: "If you looked back on your life in old age, what would 'having flourished' have to include?",
    relatedConcepts: ["golden-mean", "dichotomy-of-control", "experience-machine"],
    themes: ["meaning-purpose", "ethics-morality"],
    sourceReferences: [
      { kind: "primary", author: "Aristotle", title: "Nicomachean Ethics", location: "Books I and II" },
      { kind: "secondary", author: "Julia Annas", title: "The Morality of Happiness", year: "1993" },
    ],
  },
  {
    slug: "golden-mean",
    title: "Virtue as a mean",
    tradition: "Aristotelian virtue ethics",
    philosopher: "Aristotle",
    summary:
      "Aristotle describes many virtues as a mean between two vices, one of excess and one of deficiency, and adds that the mean is relative to us and to the situation.",
    detailedExplanation:
      "In Book II of the Nicomachean Ethics, Aristotle says that courage lies between cowardice and recklessness, and generosity between stinginess and extravagance. He is explicit that the mean is not an arithmetic midpoint but depends on the person and the circumstances, and that finding it takes practical wisdom. He also says some actions and feelings, such as murder or spite, have no mean because they are bad in themselves. The phrase 'golden mean' is a later label rather than Aristotle's own.",
    coreClaims: [
      "Many virtues sit between an excess and a deficiency.",
      "The right amount is relative to the person and the situation, and is judged by practical wisdom.",
      "Some actions and feelings are wrong outright and have no mean.",
    ],
    practicalApplication:
      "When you notice yourself leaning to an extreme (always yielding, or always pushing), ask what the opposite vice would be and what a response between them might look like here.",
    counterarguments: [
      "Critics say the doctrine is vague: it does not tell us how to find the mean in a hard case.",
      "Not every virtue fits the pattern neatly (justice and truthfulness are often given as awkward cases).",
      "Appealing to the 'sensible person' to define the mean may be circular.",
    ],
    reflectionQuestion: "Where do you tend toward an extreme, and what would the middle path look like?",
    relatedConcepts: ["eudaimonia", "ren-and-ritual"],
    themes: ["ethics-morality", "identity-self-knowledge"],
    sourceReferences: [
      { kind: "primary", author: "Aristotle", title: "Nicomachean Ethics", location: "Book II, chapters 6 to 9" },
      { kind: "secondary", author: "Rosalind Hursthouse", title: "On Virtue Ethics", year: "1999" },
    ],
  },
  {
    slug: "existence-precedes-essence",
    title: "Existence precedes essence",
    tradition: "Existentialism",
    philosopher: "Jean-Paul Sartre",
    summary:
      "Sartre claimed that, unlike a manufactured object, a human being has no pre-set purpose. We exist first and then define ourselves through our choices.",
    detailedExplanation:
      "In the lecture later published as Existentialism Is a Humanism, Sartre contrasts a paper-knife, which is made with a purpose in mind, with human beings, who (he argues) have no designer and so no fixed nature. If there is no given essence, we are 'condemned to be free' and responsible for what we make of ourselves, and for the image of humanity our choices imply. He describes the accompanying anxiety as an honest response to that freedom. Other existentialists, including religious ones, differ sharply from him, and the label covers a varied group of thinkers.",
    coreClaims: [
      "Humans have no pre-given purpose or nature; we define ourselves through what we do.",
      "Freedom brings responsibility, including for the way our choices set a standard for others.",
      "Anxiety can be an honest response to freedom rather than a malfunction.",
    ],
    practicalApplication:
      "Notice where you describe yourself as 'just the kind of person who...' and ask whether it is a fact about you or a choice you keep renewing.",
    counterarguments: [
      "Critics, including Heidegger in his later work, argued that Sartre stays within a humanism that takes the human subject as the starting point.",
      "Social and historical conditions limit choice more than the early Sartre allowed, a point Beauvoir developed and Sartre later partly accepted.",
      "Religious thinkers argue that human beings do have a purpose or nature given by God.",
    ],
    reflectionQuestion: "Which part of your identity feels fixed to you, and what would it mean to treat it as something you choose?",
    relatedConcepts: ["bad-faith", "situated-freedom", "the-absurd"],
    themes: ["meaning-purpose", "freedom-responsibility", "identity-self-knowledge"],
    sourceReferences: [
      { kind: "primary", author: "Jean-Paul Sartre", title: "Existentialism Is a Humanism", year: "1946" },
      { kind: "primary", author: "Jean-Paul Sartre", title: "Being and Nothingness", year: "1943" },
    ],
  },
  {
    slug: "bad-faith",
    title: "Bad faith",
    tradition: "Existentialism",
    philosopher: "Jean-Paul Sartre",
    summary:
      "Sartre used 'bad faith' for a form of self-deception in which we deny either our freedom or the facts of our situation, for example by saying 'I had no choice' or 'that's just who I am.'",
    detailedExplanation:
      "In Being and Nothingness, Sartre says we are always both facticity (the givens of our situation) and transcendence (our freedom to take a stance toward them). Bad faith, in his account, collapses one into the other: treating ourselves as a fixed thing, or pretending that our circumstances do not constrain us at all. His famous examples include a café waiter who plays at being a waiter. The idea is that we can hide from our freedom by hiding behind a role, a rule, or a label.",
    coreClaims: [
      "We are both shaped by our situation and free to respond to it.",
      "Bad faith is denying one of those two sides of ourselves.",
      "Roles and labels can become ways of avoiding responsibility.",
    ],
    practicalApplication:
      "When you catch yourself saying 'I have no choice' or 'that's just how I am,' ask which part is a real constraint and which part is a decision you could revisit.",
    counterarguments: [
      "Philosophers have asked whether self-deception is coherent at all: how can one person be both deceiver and deceived?",
      "The idea risks blaming people for constraints, such as poverty or discrimination, that really are limiting.",
      "'Authenticity' can become a moralizing ideal, and Sartre gives little detail about what it positively involves.",
    ],
    reflectionQuestion: "Is there a role or label you use to avoid a decision? What would you do without it?",
    relatedConcepts: ["existence-precedes-essence", "situated-freedom"],
    themes: ["identity-self-knowledge", "freedom-responsibility"],
    sourceReferences: [
      { kind: "primary", author: "Jean-Paul Sartre", title: "Being and Nothingness", year: "1943", location: "Part One, chapter 2, 'Bad Faith'" },
    ],
  },
  {
    slug: "the-absurd",
    title: "The absurd",
    tradition: "Existentialism and absurdism",
    philosopher: "Albert Camus",
    summary:
      "Camus described the absurd as the clash between our longing for meaning and a world that does not answer. His response was neither despair nor false comfort, but lucid revolt.",
    detailedExplanation:
      "In The Myth of Sisyphus, Camus argues that the basic philosophical question is whether life is worth living, and that the absurd arises when human demand for reason meets the world's silence. He rejects suicide and also what he calls philosophical suicide, a leap to a comforting answer. Instead he recommends living with the tension, with freedom and passion. He ends by saying we must imagine Sisyphus happy. Camus refused the 'existentialist' label, and his view differs from Sartre's in important ways.",
    coreClaims: [
      "The absurd comes from the mismatch between our need for meaning and the world's silence.",
      "Escaping it through suicide or through an unexamined leap of faith are both refusals to face it.",
      "We can live fully and with defiance without a guaranteed meaning.",
    ],
    practicalApplication:
      "When a task feels pointless, ask whether you can commit to doing it well and honestly anyway, without needing it to be cosmically justified.",
    counterarguments: [
      "Thomas Nagel argued that the absurd comes from our ability to step back and question our lives, and that irony may be a better response than defiance.",
      "Religious and other thinkers dispute that the world is silent about meaning.",
      "Some say Camus smuggles in a value, lucid honesty, that his own premises do not support.",
    ],
    reflectionQuestion: "What do you keep doing even though you cannot fully justify why it matters?",
    relatedConcepts: ["existence-precedes-essence", "impermanence", "experience-machine"],
    themes: ["meaning-purpose", "death-impermanence"],
    sourceReferences: [
      { kind: "primary", author: "Albert Camus", title: "The Myth of Sisyphus", year: "1942" },
      { kind: "secondary", author: "Thomas Nagel", title: "The Absurd", year: "1971", location: "The Journal of Philosophy" },
    ],
  },
  {
    slug: "impermanence",
    title: "Impermanence",
    tradition: "Buddhist philosophy",
    philosopher: "Early Buddhist teachings",
    summary:
      "Early Buddhist teaching holds that all conditioned things arise and pass away, and that suffering is bound up with clinging to what cannot last.",
    detailedExplanation:
      "In the Pali tradition the term is anicca. The Dhammapada has verses stating that all conditioned things are impermanent, and links seeing this clearly with weariness of suffering and the path to its end. The point is not only about death: it applies to moods, relationships, and the self. Buddhist traditions interpret impermanence in different ways, from momentariness theories in some Abhidharma schools to emptiness in Madhyamaka, so it is not a single doctrine.",
    coreClaims: [
      "Conditioned things, including experiences and selves, are always changing.",
      "Clinging to what changes is closely tied to dissatisfaction and suffering.",
      "Seeing change clearly can loosen that clinging.",
    ],
    practicalApplication:
      "When something is stressing you, remind yourself of how often moods and situations have shifted before, and ask what you are holding on to most tightly.",
    counterarguments: [
      "Buddhist schools disagree about what impermanence implies, so 'the Buddhist view' is an oversimplification.",
      "Secular mindfulness versions can detach the idea from its ethical and soteriological setting.",
      "Some argue that emphasizing non-clinging risks devaluing attachments, such as love and grief, that people find central to a good life.",
    ],
    reflectionQuestion: "What are you holding most tightly right now, and what would it be like to hold it more lightly?",
    relatedConcepts: ["non-self", "dichotomy-of-control", "the-absurd"],
    themes: ["death-impermanence", "meaning-purpose"],
    sourceReferences: [
      { kind: "primary", author: "Anonymous (Buddhist canon)", title: "The Dhammapada", location: "verses 277 to 279" },
      { kind: "secondary", author: "Walpola Rahula", title: "What the Buddha Taught", year: "1959" },
    ],
  },
  {
    slug: "non-self",
    title: "Non-self (anattā)",
    tradition: "Buddhist philosophy",
    philosopher: "Early Buddhist teachings",
    summary:
      "Buddhist teaching denies that there is a permanent, unchanging self. A person is understood as a changing collection of processes, and the sense of a fixed 'I' is something to examine.",
    detailedExplanation:
      "In early Buddhist texts a person is analyzed into five aggregates (body, feeling, perception, mental formations, and consciousness), none of which is a permanent self. The claim is not that you do not exist in any sense, but that the idea of an unchanging inner owner of experience does not hold up, and that clinging to it causes trouble. This was debated vigorously in India: Hindu schools such as Nyaya and Advaita Vedanta defended a self (ātman), and Buddhist thinkers argued with them. Modern philosophers such as Derek Parfit have defended views with some similarities.",
    coreClaims: [
      "There is no permanent, unchanging self behind experience.",
      "The person is a changing set of processes that we label as 'I' for convenience.",
      "Clinging to a fixed self is a source of suffering.",
    ],
    practicalApplication:
      "When you feel defensive about a criticism, ask how much of the sting comes from treating your image of yourself as something that must be protected.",
    counterarguments: [
      "Hindu philosophers argued that the unity of experience and memory requires a self, and many contemporary philosophers agree that some form of self is needed to explain agency.",
      "If there is no self, critics ask who is responsible, who is reborn, and who practices. Buddhist schools give different answers.",
      "Parfit's and similar views are controversial in their own right, so the comparison is suggestive rather than settled.",
    ],
    reflectionQuestion: "What do you point to when you say 'I'? Does it stay the same from year to year?",
    relatedConcepts: ["impermanence", "existence-precedes-essence", "floating-man"],
    themes: ["identity-self-knowledge", "death-impermanence"],
    sourceReferences: [
      { kind: "primary", author: "Anonymous (Buddhist canon)", title: "The Dhammapada", location: "verse 279" },
      { kind: "secondary", author: "Walpola Rahula", title: "What the Buddha Taught", year: "1959", location: "chapter on the doctrine of no-soul" },
      { kind: "secondary", author: "Derek Parfit", title: "Reasons and Persons", year: "1984", location: "Part Three" },
    ],
  },
  {
    slug: "pragmatic-maxim",
    title: "The pragmatic maxim",
    tradition: "Pragmatism",
    philosopher: "Charles Sanders Peirce and William James",
    summary:
      "Pragmatists hold that the meaning of an idea lies in its practical effects. To understand a belief, ask what difference it would make in experience and action.",
    detailedExplanation:
      "Peirce proposed in 1878 that we clarify our ideas by considering the conceivable practical effects of the thing we are thinking about. He saw belief as a habit of action and inquiry as driven by real doubt. William James popularized and reshaped pragmatism, saying an idea is true to the extent that it works in the long run, a claim that Peirce and many others found misleading. The movement also includes John Dewey, who emphasized inquiry as problem solving, and the views of its major figures are not identical.",
    coreClaims: [
      "To clarify an idea, trace its practical consequences.",
      "Beliefs function as habits of action, and genuine inquiry starts from real doubt.",
      "Ideas are tested over time through experience and shared inquiry.",
    ],
    practicalApplication:
      "When you are stuck in a debate, ask what would be different in practice if each side were right. If nothing would, the disagreement may be about words.",
    counterarguments: [
      "Bertrand Russell and others objected that 'truth is what works' confuses truth with usefulness.",
      "James's version seems to allow beliefs to be justified by comfort, which many find troubling.",
      "Peirce distanced himself from James's use of the word, calling his own view 'pragmaticism'.",
    ],
    reflectionQuestion: "Think of a disagreement you have been in. What would actually change in practice if you were right?",
    relatedConcepts: ["examined-life", "is-ought-gap"],
    themes: ["knowledge-truth"],
    sourceReferences: [
      { kind: "primary", author: "Charles Sanders Peirce", title: "How to Make Our Ideas Clear", year: "1878" },
      { kind: "primary", author: "William James", title: "Pragmatism", year: "1907", location: "Lectures II and VI" },
    ],
  },
  {
    slug: "veil-of-ignorance",
    title: "The veil of ignorance",
    tradition: "Contemporary political philosophy",
    philosopher: "John Rawls",
    summary:
      "Rawls proposed testing principles of justice by asking what rules you would choose for society if you did not know your own place in it.",
    detailedExplanation:
      "In A Theory of Justice, Rawls imagines people in an 'original position' who choose the basic rules of society behind a veil of ignorance: they do not know their class, talents, sex, or beliefs. He argues that, not knowing where they will end up, they would choose principles that protect equal basic liberties and arrange inequalities so they benefit the least advantaged. The device is meant to model fairness. It is a thought experiment about justification, not a claim that anyone ever made such a choice.",
    coreClaims: [
      "Fair principles are ones we could accept without knowing our own advantages.",
      "People behind the veil would protect basic liberties and limit inequalities that do not help the worst off.",
      "Justice is about the basic structure of institutions.",
    ],
    practicalApplication:
      "When setting a rule that affects others (a policy, a household arrangement), ask whether you would still endorse it if you did not know which seat you would occupy.",
    counterarguments: [
      "Libertarians such as Robert Nozick argued that the approach neglects individual entitlements and rights over what people have earned or been given.",
      "Communitarians such as Michael Sandel argued the device assumes an unrealistically detached self.",
      "Some feminist philosophers point out that the family is largely left outside the scope of Rawls's theory of justice.",
    ],
    reflectionQuestion: "Think of a rule you benefit from. Would you still defend it if you might have been on the other side of it?",
    relatedConcepts: ["categorical-imperative", "ethics-of-care", "ubuntu"],
    themes: ["ethics-morality", "society-technology-humanity"],
    sourceReferences: [
      { kind: "primary", author: "John Rawls", title: "A Theory of Justice", year: "1971", location: "especially sections 3 and 24" },
      { kind: "secondary", author: "Samuel Freeman", title: "Rawls", year: "2007" },
    ],
  },
  {
    slug: "ethics-of-care",
    title: "The ethics of care",
    tradition: "Feminist philosophy",
    philosopher: "Carol Gilligan, Nel Noddings, and Virginia Held",
    summary:
      "The ethics of care starts from the idea that moral life grows out of relationships of dependence and responsiveness, and it treats caring as a practice and a value in its own right.",
    detailedExplanation:
      "Carol Gilligan's In a Different Voice (1982) argued that moral development research had overlooked a perspective centered on relationships and responsibility. Philosophers such as Nel Noddings and Virginia Held developed this into an ethical theory that treats care, attentiveness, and responsiveness to particular people as basic, in contrast to approaches centered on abstract rules or impartial calculation. Held and others present care as complementary to justice rather than a replacement for it.",
    coreClaims: [
      "Human beings begin life dependent, so relationships of care are basic to morality.",
      "Moral attention to particular people and their needs matters, not only impartial principles.",
      "Care is both a practice and a value, and caring work deserves recognition.",
    ],
    practicalApplication:
      "In a hard decision involving others, ask who is affected, what each of them actually needs, and how you can respond to them as particular people.",
    counterarguments: [
      "Gilligan's empirical claim about gender differences in moral reasoning has been contested.",
      "Critics worry that an ethic of care could reinforce expectations that women provide unpaid care.",
      "It can be unclear how care extends to strangers or to large-scale questions of justice.",
    ],
    reflectionQuestion: "Who depends on you, and who do you depend on? How does that change what you owe?",
    relatedConcepts: ["veil-of-ignorance", "ubuntu", "ren-and-ritual"],
    themes: ["love-relationships", "ethics-morality"],
    sourceReferences: [
      { kind: "primary", author: "Carol Gilligan", title: "In a Different Voice", year: "1982" },
      { kind: "primary", author: "Nel Noddings", title: "Caring: A Feminine Approach to Ethics and Moral Education", year: "1984" },
      { kind: "secondary", author: "Virginia Held", title: "The Ethics of Care: Personal, Political, and Global", year: "2006" },
    ],
  },
  {
    slug: "ubuntu",
    title: "Ubuntu: personhood through others",
    tradition: "African philosophy",
    philosopher: "Southern African thought; Mogobe Ramose and Thaddeus Metz among later interpreters",
    summary:
      "Ubuntu is a family of ideas associated with Southern African communities, often summarized in the Nguni saying that a person is a person through other persons. Personhood is understood as relational.",
    detailedExplanation:
      "The maxim (in isiZulu, umuntu ngumuntu ngabantu) is usually read as saying that we become fully persons through our relationships with others, and that moral life is about harmony, solidarity, and recognizing one another's humanity. Scholars such as Mogobe Ramose and Thaddeus Metz have worked to state ubuntu as a philosophical or moral theory. They interpret it in different ways, and there is no single canonical version. 'African philosophy' also covers many distinct traditions, so ubuntu is one strand and should not be taken to speak for the whole continent.",
    coreClaims: [
      "Personhood is relational and developed through community.",
      "Moral value is tied to harmonious relationships and solidarity.",
      "Individuals have dignity, and are also bound up in the wellbeing of others.",
    ],
    practicalApplication:
      "Before deciding something that affects others, ask how it will affect the relationships and the community that your own life depends on.",
    counterarguments: [
      "Interpretations differ widely, and critics worry that the term is sometimes used loosely or romantically.",
      "Some fear that an emphasis on community could pressure individuals to conform or silence dissent.",
      "Scholars debate how to connect the ideal to the actual historical practices of particular communities.",
    ],
    reflectionQuestion: "Which of your abilities or values did you receive from other people?",
    relatedConcepts: ["ethics-of-care", "ren-and-ritual", "place-and-knowledge"],
    themes: ["love-relationships", "ethics-morality", "society-technology-humanity"],
    sourceReferences: [
      { kind: "secondary", author: "Mogobe B. Ramose", title: "African Philosophy through Ubuntu", year: "1999" },
      { kind: "secondary", author: "Thaddeus Metz", title: "Toward an African Moral Theory", year: "2007", location: "Journal of Political Philosophy" },
    ],
  },
  {
    slug: "wu-wei",
    title: "Wu wei: effortless action",
    tradition: "Daoism",
    philosopher: "Laozi (Daodejing) and Zhuangzi",
    summary:
      "Wu wei, often translated as 'non-action' or 'effortless action', describes acting in harmony with circumstances rather than forcing things. It is associated with skill, responsiveness, and letting go of rigid striving.",
    detailedExplanation:
      "The Daodejing speaks of the Dao 'doing nothing' and yet leaving nothing undone, and recommends yielding and simplicity. The Zhuangzi gives the story of Cook Ding, whose butchering is so skilled that he follows the natural structure of the ox and his knife never dulls. Interpreters differ on whether wu wei is mainly about spontaneous skill, about a political style of light-handed rule, or about a mystical attunement, and the word is notoriously hard to translate.",
    coreClaims: [
      "Forcing outcomes often backfires; responsive, skillful action works with the grain of things.",
      "Yielding and simplicity can be strengths.",
      "Rigid conventional striving can distance us from what is natural and spontaneous.",
    ],
    practicalApplication:
      "When you are straining at something, ask what it would look like to prepare well and then act more lightly, responding to what is actually happening.",
    counterarguments: [
      "It can sound like passivity or an excuse for inaction, especially in the face of injustice.",
      "Confucian and Legalist thinkers argued that society requires active cultivation, ritual, and law.",
      "Translations and interpretations vary so much that confident summaries should be treated with caution.",
    ],
    reflectionQuestion: "Where in your life are you forcing something that might work better if you eased off?",
    relatedConcepts: ["dichotomy-of-control", "ren-and-ritual", "impermanence"],
    themes: ["freedom-responsibility", "meaning-purpose"],
    sourceReferences: [
      { kind: "primary", author: "Laozi", title: "Daodejing", location: "for example chapter 37" },
      { kind: "primary", author: "Zhuangzi", title: "Zhuangzi", location: "the Cook Ding story in the third inner chapter" },
      { kind: "secondary", author: "Edward Slingerland", title: "Effortless Action: Wu-wei as Conceptual Metaphor and Spiritual Ideal in Early China", year: "2003" },
    ],
  },
  {
    slug: "ren-and-ritual",
    title: "Ren and ritual: becoming humane",
    tradition: "Confucian ethics",
    philosopher: "Confucius, Mencius, and Xunzi",
    summary:
      "In the Analects, ren (humaneness) is cultivated through study, reflection, and the practice of ritual (li) within relationships. Moral growth is a lifelong, shared project.",
    detailedExplanation:
      "Confucius connects ren with caring for others and with disciplined self-cultivation through li, the forms of conduct that express respect in family and public life. The Analects records him linking the two when asked about ren. Later Confucians disagreed about human nature: Mencius held that we have inborn moral sprouts that need nurturing, while Xunzi held that our natural tendencies need shaping by ritual and education. For Confucians, ethics is relational and role-based, though reciprocal rather than simple obedience.",
    coreClaims: [
      "Moral character is built through practice, learning, and example.",
      "Ethics is lived in relationships such as family, friendship, and community, with mutual obligations.",
      "Ritual gives shape to respect and care, and helps form the person who practices it.",
    ],
    practicalApplication:
      "Treat small routines of respect (greeting, listening, showing up) as practice that forms your character, not as empty formalities.",
    counterarguments: [
      "Critics have argued that Confucian role ethics can reinforce hierarchy, including patriarchal norms.",
      "The ancient thinker Mozi argued that graded concern for family conflicts with impartial care for all.",
      "Contemporary Confucians disagree about how much of the tradition to keep, and how to reinterpret it.",
    ],
    reflectionQuestion: "Which small, repeated practice has most shaped the kind of person you are?",
    relatedConcepts: ["golden-mean", "ethics-of-care", "ubuntu", "wu-wei"],
    themes: ["ethics-morality", "love-relationships"],
    sourceReferences: [
      { kind: "primary", author: "Confucius", title: "Analects", location: "book 12, chapter 1" },
      { kind: "secondary", author: "Philip J. Ivanhoe", title: "Confucian Moral Self Cultivation", year: "2000" },
    ],
  },
  {
    slug: "categorical-imperative",
    title: "The categorical imperative",
    tradition: "Kantian ethics",
    philosopher: "Immanuel Kant",
    summary:
      "Kant argued that moral duties are unconditional and can be tested by asking whether we could will the principle behind our action as a universal law, and whether we treat people as ends and not merely as means.",
    detailedExplanation:
      "In the Groundwork of the Metaphysics of Morals, Kant offers several formulations of one basic principle. The formula of universal law tells us to act only on principles we could will everyone to follow. The formula of humanity tells us to treat humanity, in ourselves and others, never merely as a means. Kant thought moral worth lies in acting from duty and respect for rational agents' autonomy, not from inclination or from calculating consequences.",
    coreClaims: [
      "Moral duties apply regardless of our desires.",
      "A principle is permissible only if it could be a universal law without contradiction in conception or will.",
      "Persons have dignity and must never be used merely as tools.",
    ],
    practicalApplication:
      "Before making an exception for yourself, ask what would happen if everyone in your position did the same, and whether you are using anyone merely as a tool.",
    counterarguments: [
      "Kant's strictness about lying, even to a murderer at the door, strikes many as implausible.",
      "Hegel and others criticized the universalizability test as empty formalism that can be made to approve almost anything.",
      "Duties can conflict, and Kant offers limited help in weighing them. Consequentialists argue outcomes must matter more.",
    ],
    reflectionQuestion: "Is there a rule you ask others to follow that you quietly exempt yourself from?",
    relatedConcepts: ["veil-of-ignorance", "ethics-of-care", "eudaimonia"],
    themes: ["ethics-morality", "freedom-responsibility"],
    sourceReferences: [
      { kind: "primary", author: "Immanuel Kant", title: "Groundwork of the Metaphysics of Morals", year: "1785" },
      { kind: "secondary", author: "Christine M. Korsgaard", title: "Creating the Kingdom of Ends", year: "1996" },
    ],
  },
  {
    slug: "experience-machine",
    title: "The experience machine",
    tradition: "Philosophy of well-being",
    philosopher: "Robert Nozick",
    summary:
      "Nozick asked whether you would plug into a machine that gave you any experiences you liked, indefinitely. Many people hesitate, which he took to suggest we care about more than pleasant experiences.",
    detailedExplanation:
      "In Anarchy, State, and Utopia, Nozick describes a machine that could give you the experience of writing a great novel or having wonderful friendships, with your mind unable to tell the difference. He suggests that many people would decline, and argues this shows we want to actually do things and be a certain way, and to be in contact with reality. The thought experiment is aimed at hedonism, the view that only pleasant experience matters. It is widely discussed, but its force is disputed.",
    coreClaims: [
      "If pleasant experience were all that mattered, plugging in would be obviously right.",
      "Many people would still refuse, suggesting they value acting, being, and contact with reality.",
      "Well-being may involve more than how our lives feel from the inside.",
    ],
    practicalApplication:
      "When chasing a feeling (comfort, approval), ask whether you would still want it if you knew it was not tied to anything real.",
    counterarguments: [
      "Some researchers suggest our reluctance reflects status-quo bias rather than a considered value: people respond differently when asked whether they would leave the machine.",
      "Hedonists argue that intuitions about such a strange case are unreliable.",
      "It is unclear how much the thought experiment shows about real choices, which are rarely all-or-nothing.",
    ],
    reflectionQuestion: "What do you want that could not be given to you by simply feeling that you had it?",
    relatedConcepts: ["eudaimonia", "the-absurd", "allegory-of-the-cave"],
    themes: ["meaning-purpose", "knowledge-truth"],
    sourceReferences: [
      { kind: "primary", author: "Robert Nozick", title: "Anarchy, State, and Utopia", year: "1974", location: "chapter 3" },
      { kind: "secondary", author: "Felipe De Brigard", title: "If You Like It, Does It Matter If It's Real?", year: "2010", location: "Philosophical Psychology" },
    ],
  },
  {
    slug: "allegory-of-the-cave",
    title: "The allegory of the cave",
    tradition: "Platonism",
    philosopher: "Plato",
    summary:
      "In the Republic, Plato compares ordinary understanding to prisoners who mistake shadows on a wall for reality. Education, he suggests, is turning the soul toward what is truly real.",
    detailedExplanation:
      "In Book VII of the Republic, Socrates describes prisoners chained in a cave who see only shadows cast by objects behind them. One prisoner is freed, finds the light painful, and gradually learns that the shadows were images. Plato uses the story to illustrate his view that the ordinary world is a copy of more real intelligible things (the Forms), and that education is a difficult reorientation, not the filling of an empty mind. The freed prisoner is then asked to return and help those still below.",
    coreClaims: [
      "What seems obvious can be a shadow of something more real.",
      "Education is turning the whole soul toward the truth, and can be uncomfortable.",
      "Those who see more clearly may owe something to those who do not.",
    ],
    practicalApplication:
      "Ask what you take for granted because everyone around you does, and where your information comes from.",
    counterarguments: [
      "Plato's theory of Forms is highly contested, and many philosophers reject it.",
      "Karl Popper and others argued that the picture of a knowing elite guiding others has authoritarian implications.",
      "Empiricists argue that knowledge begins in experience rather than in a turn away from it.",
    ],
    reflectionQuestion: "What is something you once believed firmly that you now see differently, and what changed?",
    relatedConcepts: ["examined-life", "experience-machine", "floating-man"],
    themes: ["knowledge-truth", "society-technology-humanity"],
    sourceReferences: [
      { kind: "primary", author: "Plato", title: "Republic", location: "Book VII, the passage beginning at 514a" },
      { kind: "secondary", author: "Julia Annas", title: "An Introduction to Plato's Republic", year: "1981" },
    ],
  },
  {
    slug: "is-ought-gap",
    title: "The is-ought gap",
    tradition: "Empiricism",
    philosopher: "David Hume",
    summary:
      "Hume observed that writers often move from statements about how things are to claims about how they ought to be without explaining the step. The gap asks us to make the value premise explicit.",
    detailedExplanation:
      "In a short passage of the Treatise of Human Nature, Hume notes that moral systems often start by describing God, human affairs, or nature and then shift to what ought to be done, without saying how the 'ought' follows. Philosophers have read this in several ways, from a strict logical gap between facts and values to a more modest warning about hidden premises. Hume himself held that moral judgments rest on sentiment as well as reason. Whether and how the gap can be bridged remains debated.",
    coreClaims: [
      "Descriptive facts alone do not logically entail what we ought to do.",
      "Arguments that seem to move from facts to values rely on an additional value premise.",
      "Moral evaluation involves more than gathering facts.",
    ],
    practicalApplication:
      "When someone argues from what is natural, common, or efficient to what we should do, ask what value is doing the work in the middle.",
    counterarguments: [
      "John Searle argued that institutional facts such as promising can yield obligations.",
      "Some neo-Aristotelians argue that facts about human nature and flourishing can ground values.",
      "Moral realists claim there are moral facts, which would make the gap less sharp.",
    ],
    reflectionQuestion: "Think of an argument you accept that goes from 'this is how things are' to 'so this is what we should do.' What value is it assuming?",
    relatedConcepts: ["pragmatic-maxim", "veil-of-ignorance"],
    themes: ["knowledge-truth", "ethics-morality"],
    sourceReferences: [
      { kind: "primary", author: "David Hume", title: "A Treatise of Human Nature", year: "1739 to 1740", location: "Book III, Part I, Section I" },
      { kind: "secondary", author: "John R. Searle", title: "How to Derive 'Ought' from 'Is'", year: "1964", location: "The Philosophical Review" },
    ],
  },
  {
    slug: "situated-freedom",
    title: "Situated freedom",
    tradition: "Feminist philosophy and existentialism",
    philosopher: "Simone de Beauvoir",
    summary:
      "Beauvoir argued that freedom is always exercised within a situation, and that social structures can limit the options that feel open to different people. Our freedom is also bound up with the freedom of others.",
    detailedExplanation:
      "In The Ethics of Ambiguity, Beauvoir develops an existentialist ethics in which each person's freedom depends on, and should aim at, the freedom of others. In The Second Sex, she examines how women have been placed as 'Other' by social arrangements, and writes that one is not born but becomes a woman. Her view takes Sartre's emphasis on freedom and adds a stronger account of how oppression and social conditions shape what choices people actually have.",
    coreClaims: [
      "Freedom is always exercised in a concrete situation shaped by history and society.",
      "Oppression limits people's real options, and cannot be dismissed as simply a matter of attitude.",
      "Our freedom is tied up with others' freedom, so we have reasons to oppose oppression.",
    ],
    practicalApplication:
      "When judging someone's choices, ask what options were realistically available to them, and ask the same of your own.",
    counterarguments: [
      "Critics, including many Black and postcolonial feminists, note that Beauvoir's analysis draws mostly on the experience of European women of a particular class.",
      "Some argue her ideal of transcendence undervalues activities, such as caregiving, traditionally associated with women.",
      "There is debate about how much she departs from Sartre's more individualist view.",
    ],
    reflectionQuestion: "Where have circumstances narrowed your options, and where have you accepted limits you could contest?",
    relatedConcepts: ["existence-precedes-essence", "bad-faith", "ethics-of-care"],
    themes: ["freedom-responsibility", "identity-self-knowledge", "society-technology-humanity"],
    sourceReferences: [
      { kind: "primary", author: "Simone de Beauvoir", title: "The Ethics of Ambiguity", year: "1947" },
      { kind: "primary", author: "Simone de Beauvoir", title: "The Second Sex", year: "1949" },
    ],
  },
  {
    slug: "floating-man",
    title: "The floating man",
    tradition: "Islamic philosophy",
    philosopher: "Avicenna (Ibn Sina)",
    summary:
      "Avicenna imagined a person created all at once, suspended in air with no sensory input, and argued that such a person would still be aware of their own existence. He took this to suggest that self-awareness does not depend on the body.",
    detailedExplanation:
      "The thought experiment appears in Avicenna's writings on the soul, including the psychology section of his encyclopedic Kitab al-Shifa (The Healing). He asks us to imagine a fully formed adult, blindfolded and floating, unable to perceive anything, even his own limbs. He argues the person would still affirm his own existence. Scholars disagree about its purpose, whether as a proof of an immaterial soul or as a way to point to a basic, direct self-awareness. It is often compared to Descartes's later arguments, though the contexts differ.",
    coreClaims: [
      "Self-awareness seems possible without perceiving the body or the world.",
      "This suggests the self is not simply identical to the body.",
      "Our first-person awareness is basic and does not need to be inferred.",
    ],
    practicalApplication:
      "Try a minute of sitting still with eyes closed and ask what remains when you set aside the senses. Notice what you take to be 'you.'",
    counterarguments: [
      "Being able to imagine something does not show it is possible, so the argument may show only what we can conceive.",
      "Scholars debate whether Avicenna intended it as a strict proof or as a pointer.",
      "Contemporary research on embodied cognition suggests that self-awareness is closely tied to bodily experience.",
    ],
    reflectionQuestion: "What part of your sense of 'I' would remain if all your senses went quiet?",
    relatedConcepts: ["non-self", "allegory-of-the-cave"],
    themes: ["identity-self-knowledge", "knowledge-truth"],
    sourceReferences: [
      { kind: "primary", author: "Avicenna (Ibn Sina)", title: "Kitab al-Shifa (The Healing)", location: "the book on the soul, first treatise" },
      { kind: "secondary", author: "Jari Kaukua", title: "Self-Awareness in Islamic Philosophy: Avicenna and Beyond", year: "2015" },
    ],
  },
  {
    slug: "place-and-knowledge",
    title: "Place, relationship, and knowledge",
    tradition: "Indigenous philosophy",
    philosopher: "Vine Deloria Jr. and later Indigenous philosophers",
    summary:
      "Vine Deloria Jr. argued that many American Indian traditions center sacred places and relationships, while Western thought often centers history and time. Many Indigenous thinkers connect knowledge and obligation to particular lands.",
    detailedExplanation:
      "In God Is Red (1973), Deloria contrasted a place-centered orientation, typical (he argued) of many American Indian traditions, with a time-centered orientation in Western religion and historiography. Later Indigenous philosophers develop related themes: that knowledge arises in relationship with land and with human and non-human beings, and that this brings responsibilities. This is a generalization across hundreds of distinct nations with their own languages and philosophies, and scholars debate how far such broad contrasts hold. Read it as one influential contribution rather than a summary of 'Indigenous thought'.",
    coreClaims: [
      "Knowledge and obligation can be tied to particular places and relationships.",
      "Land and non-human beings may be understood as relatives rather than as resources.",
      "Different cultural traditions frame time, place, and history in different ways.",
    ],
    practicalApplication:
      "Learn the history and the original names of the land you live on, and ask what responsibilities come with living there.",
    counterarguments: [
      "Broad contrasts between 'Indigenous' and 'Western' thought can flatten the diversity within each.",
      "Some scholars argue that Deloria's space-versus-time contrast is too neat and that both place and time matter in all traditions.",
      "There is a risk of romanticizing or appropriating traditions that are living and contested.",
    ],
    reflectionQuestion: "What place do you feel responsible to, and what does that responsibility ask of you?",
    relatedConcepts: ["ubuntu", "impermanence"],
    themes: ["society-technology-humanity", "knowledge-truth"],
    sourceReferences: [
      { kind: "primary", author: "Vine Deloria Jr.", title: "God Is Red", year: "1973" },
      { kind: "secondary", author: "Brian Burkhart", title: "Indigenizing Philosophy through the Land", year: "2019" },
    ],
  },
];

export const concepts: Concept[] = seeds.map((seed) => ({ ...seed, contentType: "concept" as const, publicationStatus: "approved" as const }));
