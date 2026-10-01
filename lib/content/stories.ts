import type { StaticImageData } from "next/image";
import type { Program } from "../programs";
import cityEvening from "@/public/images/stories/city-evening.jpg";
import classroomSmiles from "@/public/images/stories/classroom-smiles.jpg";
import classSelfie from "@/public/images/stories/class-selfie.jpg";
import colouringPages from "@/public/images/stories/colouring-pages.jpg";
import thankYouCard from "@/public/images/stories/thank-you-card.jpg";
import teachingCharacters from "@/public/images/stories/teaching-characters.jpg";
import thankYouHug from "@/public/images/stories/thank-you-hug.jpg";
import thankYouLetters from "@/public/images/stories/thank-you-letters.jpg";
import craftTable from "@/public/images/stories/craft-table.jpg";
import storytimeTablet from "@/public/images/stories/storytime-tablet.jpg";
import classCheer from "@/public/images/stories/class-cheer.jpg";
import morningCircle from "@/public/images/stories/morning-circle.jpg";

/**
 * "People who actually did it" — real material from AIESEC in Poland
 * exchanges (provided by AIESEC in Poland). Nothing here is invented.
 */

/** Real exchange photos, shown as a photo wall. */
export interface Moment {
  src: StaticImageData;
  alt: string;
  caption: string;
}

export const MOMENTS: Moment[] = [
  { src: thankYouCard, alt: "An exchange participant surrounded by laughing children holding up a hand-made card", caption: "the last day" },
  { src: teachingCharacters, alt: "An exchange participant teaching a group of children sitting on a classroom carpet, with characters on the screen", caption: "lesson time" },
  { src: thankYouHug, alt: "A child hugging an exchange participant while another holds up a drawing", caption: "a goodbye hug" },
  { src: classSelfie, alt: "A class selfie of an exchange participant with a group of smiling children", caption: "class photo" },
  { src: craftTable, alt: "An exchange participant and children making paper crafts at a classroom table", caption: "craft time" },
  { src: cityEvening, alt: "An exchange participant smiling in a city square in the evening", caption: "evenings off" },
  { src: colouringPages, alt: "Children proudly showing colouring pages next to an exchange participant", caption: "proud artists" },
  { src: storytimeTablet, alt: "An exchange participant showing something on a tablet to children gathered around her", caption: "story time" },
  { src: classCheer, alt: "A class of children cheering with their arms up around an exchange participant", caption: "the whole class" },
  { src: thankYouLetters, alt: "Two exchange participants reading thank-you cards from young children", caption: "thank-you letters" },
  { src: classroomSmiles, alt: "Children and an exchange participant smiling at a table in a bright classroom", caption: "new friends" },
  { src: morningCircle, alt: "An exchange participant reading to children sitting on a carpet in a school hall", caption: "morning circle" },
];

/** Testimonial reels published by AIESEC in Poland on Facebook. */
export const REELS: { href: string; label: string }[] = [
  { href: "https://www.facebook.com/reel/1366876251612853", label: "Testimonial reel #1" },
  { href: "https://www.facebook.com/reel/745530031828359", label: "Testimonial reel #2" },
];

/**
 * Written testimonials. Add real quotes here (with the person's consent) and
 * they appear above the photo wall. Leave empty to show photos and videos only.
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
}

export const STORIES: Story[] = [];
