import type { Program } from "../programs";

/**
 * "People who actually did it" — real participant stories only.
 *
 * Add entries here once AIESEC in Poland has collected them (with the
 * person's consent). The home page shows this section only when there is at
 * least one real story. In development, clearly marked placeholders are shown
 * so the layout can be reviewed.
 */
export interface Story {
  quote: string;
  name: string;
  /** Home country */
  from: string;
  program: Program;
  /** Where in Poland */
  place: string;
  year?: number;
  /** Optional: path to a photo in /public/images/stories (with consent) */
  photo?: string;
}

export const STORIES: Story[] = [];

export const PLACEHOLDER_STORIES: Story[] = [
  {
    quote: "PLACEHOLDER — replace with a real quote from an iGV participant about their project in Poland.",
    name: "Participant name",
    from: "Country",
    program: "igv",
    place: "City",
  },
  {
    quote: "PLACEHOLDER — replace with a real quote from an iGTa intern about working in a Polish company.",
    name: "Participant name",
    from: "Country",
    program: "igta",
    place: "City",
  },
  {
    quote: "PLACEHOLDER — replace with a real quote from an iGTe teacher about their classroom in Poland.",
    name: "Participant name",
    from: "Country",
    program: "igte",
    place: "City",
  },
];
