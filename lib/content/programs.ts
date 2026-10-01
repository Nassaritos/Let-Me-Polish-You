import type { Program } from "../programs";

/** Plain-language program descriptions (general, not opportunity-specific). */
export const PROGRAM_CONTENT: Record<
  Program,
  { promise: string; who: string; themes: string[]; what: string; length: string; you: string; get: string }
> = {
  igv: {
    promise: "Make an impact.",
    who: "For anyone 18–30 who wants a summer that matters to someone else.",
    themes: ["Community projects", "UN Global Goals", "Culture exchange"],
    what: "A volunteering project with a local partner — schools, NGOs, foundations — built around one of the UN Sustainable Development Goals.",
    length: "Usually short: a few weeks, often over a summer or a break.",
    you: "Young people 18–30 who want to contribute, meet the world and grow as leaders.",
    get: "What's provided (food, accommodation, transport) depends on the project — every opportunity lists it.",
  },
  igta: {
    promise: "Build your career.",
    who: "For students and graduates who want real work experience abroad.",
    themes: ["Real work experience", "Polish companies", "Skills for your CV"],
    what: "A professional internship with a company or organisation in Poland, in a field linked to your studies or experience.",
    length: "Longer: from a few months up to around a year and a half.",
    you: "Students and recent graduates who want international work experience.",
    get: "Many internships list a salary — each opportunity shows exactly what's offered.",
  },
  igte: {
    promise: "Change a classroom.",
    who: "For people who love languages, kids and explaining things well.",
    themes: ["Schools & kindergartens", "Your language", "Daily impact"],
    what: "A teaching placement in a school, kindergarten or learning centre — often language teaching and cultural education.",
    length: "Usually several months.",
    you: "People who love languages, education and working with children or young people.",
    get: "Support and benefits vary by school — each opportunity lists them.",
  },
};
