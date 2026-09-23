import type { Tradition } from "./types";

export const traditions: Tradition[] = [
  { id: "ancient-greek", name: "Ancient Greek Philosophy", region: "Europe", blurb: "The classical Athenian tradition of reasoned inquiry into ethics, knowledge, and reality." },
  { id: "hellenistic", name: "Hellenistic Philosophy", region: "Europe / Mediterranean", blurb: "Stoicism and related schools focused on how to live well amid what we can't control." },
  { id: "islamic", name: "Islamic Philosophy", region: "Middle East / Central Asia", blurb: "The Islamic Golden Age synthesis of Greek philosophy, logic, and theology." },
  { id: "buddhist", name: "Buddhist Philosophy", region: "South Asia", blurb: "Traditions examining suffering, impermanence, and the nature of the self." },
  { id: "vedanta", name: "Vedanta / Hindu Philosophy", region: "South Asia", blurb: "Traditions exploring the relationship between the individual self and ultimate reality." },
  { id: "confucian", name: "Confucianism", region: "East Asia", blurb: "An ethics of relationship, ritual, and self-cultivation aimed at social harmony." },
  { id: "daoist", name: "Daoism", region: "East Asia", blurb: "A philosophy of aligning with the natural flow of things rather than forcing outcomes." },
  { id: "african", name: "African Philosophy", region: "Africa", blurb: "Traditions ranging from early written philosophy to contemporary work on personhood and community." },
  { id: "indigenous-american", name: "Indigenous American Philosophy", region: "Americas", blurb: "Traditions grounded in land, relationship, and ways of knowing distinct from European frameworks." },
  { id: "rationalism-empiricism", name: "Rationalism & Empiricism", region: "Europe", blurb: "The early modern debate over whether knowledge comes from reason or experience." },
  { id: "german-idealism", name: "German Idealism", region: "Europe", blurb: "A tradition centering mind, freedom, and history as unfolding through reason." },
  { id: "existentialism", name: "Existentialism", region: "Europe", blurb: "Philosophy centered on freedom, individual existence, and self-created meaning." },
  { id: "critical-theory", name: "Marxism & Critical Theory", region: "Europe", blurb: "Analysis of how economic and social structures shape ideas, freedom, and power." },
  { id: "analytic-political", name: "Utilitarian & Analytic Political Philosophy", region: "Europe / Anglosphere", blurb: "Rigorous, argument-first approaches to ethics, justice, and public policy." },
  { id: "contemporary-global", name: "Contemporary Global Philosophy", region: "Global", blurb: "Living traditions engaging directly with today's political and social questions." },
];

export function getTradition(id: string) {
  return traditions.find((t) => t.id === id);
}
