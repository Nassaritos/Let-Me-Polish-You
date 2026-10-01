import type { StaticImageData } from "next/image";
import type { Program } from "./programs";

import warsaw from "@/public/images/cities/warsaw.jpg";
import krakow from "@/public/images/cities/krakow.jpg";
import lodz from "@/public/images/cities/lodz.jpg";
import poznan from "@/public/images/cities/poznan.jpg";
import katowice from "@/public/images/cities/katowice.jpg";
import lublin from "@/public/images/cities/lublin.jpg";
import gdansk from "@/public/images/cities/gdansk.jpg";
import warsawRails from "@/public/images/poland/warsaw-rails.jpg";
import morskieOko from "@/public/images/poland/morskie-oko.jpg";
import masuria from "@/public/images/poland/masuria.jpg";
import bison from "@/public/images/poland/bison.jpg";
import zalipie from "@/public/images/poland/zalipie.jpg";
import pierogi from "@/public/images/poland/pierogi.jpg";
import pendolino from "@/public/images/poland/pendolino.jpg";
import departure from "@/public/images/poland/departure.jpg";
import warsawVistula from "@/public/images/igta/warsaw-skyline-vistula.jpg";
import classroomVr from "@/public/images/igte/classroom-vr.jpg";
import workshopTeacher from "@/public/images/igte/workshop-teacher.jpg";
import workshopOrigami from "@/public/images/igv/workshop-origami.jpg";
import juwenaliaParade from "@/public/images/youth/juwenalia-parade.jpg";
import juwenaliaCrowd from "@/public/images/youth/juwenalia-crowd.jpg";
import juwenaliaConcert from "@/public/images/youth/juwenalia-concert.jpg";
import warsawBoulevards from "@/public/images/youth/warsaw-boulevards.jpg";
import krakowNight from "@/public/images/youth/krakow-boulevards-night.jpg";
import exchangeThankYou from "@/public/images/stories/thank-you-card.jpg";
import exchangeTeaching from "@/public/images/stories/teaching-characters.jpg";

/**
 * Every photograph used on the site, with its licence and attribution.
 * Components import from here — never hard-code image paths elsewhere.
 * Images are from Wikimedia Commons under the licence listed, except the
 * exchange photos provided by AIESEC in Poland.
 */

export interface Credit {
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
}

export interface Photo {
  src: StaticImageData;
  alt: string;
  /** CSS object-position for art-directed crops */
  position?: string;
  credit: Credit;
}

const BY4 = "https://creativecommons.org/licenses/by/4.0/";
const BYSA4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const BYSA3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const BY3 = "https://creativecommons.org/licenses/by/3.0/";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";

export const PHOTOS = {
  warsaw: {
    src: warsaw,
    alt: "Warsaw's skyline in winter, with the Palace of Culture and Science among glass towers",
    position: "60% 50%",
    credit: { author: "Quintin Soloviev", license: "CC BY 4.0", licenseUrl: BY4, source: "https://commons.wikimedia.org/wiki/File:Warsaw_skyline.jpg" },
  },
  krakow: {
    src: krakow,
    alt: "Wawel Castle above the Vistula river in Kraków in autumn",
    position: "45% 50%",
    credit: { author: "Ingo Mehling", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Krakow_-_Wawel_from_Vistula_-_4.jpg" },
  },
  lodz: {
    src: lodz,
    alt: "People cycling and walking along Piotrkowska Street in Łódź",
    credit: { author: "WrS.tm.pl", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Piotrkowska_Street_in_%C5%81%C3%B3d%C5%BA_at_the_intersection_with_Tuwima_Street._July_2023,_%C5%81%C3%B3dz,_Poland.jpg" },
  },
  poznan: {
    src: poznan,
    alt: "Colourful merchant houses and café terraces on the Old Market Square in Poznań",
    credit: { author: "Mariochom", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Pozna%C5%84-Old_Market_Square.jpg" },
  },
  katowice: {
    src: katowice,
    alt: "The Spodek arena in Katowice, shaped like a flying saucer",
    credit: { author: "Mike Peel (www.mikepeel.net)", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:At_Katowice_2024_430_-_Spodek.jpg" },
  },
  lublin: {
    src: lublin,
    alt: "Café terraces and Renaissance façades in Lublin's Old Town",
    credit: { author: "Andrew Milligan sumo", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", source: "https://commons.wikimedia.org/wiki/File:Old_Town,_Lublin_(50311471038).jpg" },
  },
  gdansk: {
    src: gdansk,
    alt: "Historic waterfront houses along the Motława river in Gdańsk",
    credit: { author: "Miha Peče", license: "CC BY 4.0", licenseUrl: BY4, source: "https://commons.wikimedia.org/wiki/File:D%C5%82ugie_Pobrze%C5%BCe_Street_in_Gda%C5%84sk.jpg" },
  },
  warsawRails: {
    src: warsawRails,
    alt: "Railway tracks curving towards the Warsaw skyline at dusk",
    credit: { author: "Robert von Oliva (naruciakk)", license: "CC0", licenseUrl: CC0, source: "https://commons.wikimedia.org/wiki/File:The_view_of_the_Warsaw_skyline_as_seen_from_the_SW_end_of_the_platform_2,_Warszawa_Zacisze-Wilno_railway_station.jpg" },
  },
  morskieOko: {
    src: morskieOko,
    alt: "Morskie Oko lake reflecting the Tatra peaks at sunrise",
    position: "50% 40%",
    credit: { author: "Aneta Pawska", license: "CC BY 3.0", licenseUrl: BY3, source: "https://commons.wikimedia.org/wiki/File:Morskie_Oko_o_poranku.jpg" },
  },
  masuria: {
    src: masuria,
    alt: "A Masurian lake at dusk under a violet sky",
    credit: { author: "Wszatanka", license: "CC BY 3.0", licenseUrl: BY3, source: "https://commons.wikimedia.org/wiki/File:Mazurskie_jezioro.jpg" },
  },
  bison: {
    src: bison,
    alt: "A European bison standing in a meadow in Białowieża",
    position: "40% 50%",
    credit: { author: "Charles J. Sharp", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:European_bison_(Bison_bonasus)_male_Bia%C5%82owieza.jpg" },
  },
  zalipie: {
    src: zalipie,
    alt: "A thatched cottage and well painted with folk flowers in Zalipie",
    credit: { author: "Jakub Hałun", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:20170815_Zalipie_5497_DxO.jpg" },
  },
  pierogi: {
    src: pierogi,
    alt: "Hands folding pierogi dough on a floured wooden board",
    credit: { author: "Diego Delso", license: "CC BY-SA 3.0", licenseUrl: BYSA3, source: "https://commons.wikimedia.org/wiki/File:Pierogi,_Gniezno,_Polonia2.jpg" },
  },
  pendolino: {
    src: pendolino,
    alt: "A PKP Intercity Pendolino train crossing the Polish countryside",
    credit: { author: "Jakub Hałun", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Pendolino_ED250_PKP_Intercity_na_linii_kolejowej_nr_8_pod_S%C5%82omnikami_20200808_1010_3443.jpg" },
  },
  departure: {
    src: departure,
    alt: "A young traveller with a suitcase walking through an airport hall",
    position: "35% 50%",
    credit: { author: "AIESEC Greece", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Young_Person_staring_an_AIESEC_Experience.jpg" },
  },
  warsawVistula: {
    src: warsawVistula,
    alt: "Warsaw's business district rising above the Vistula river",
    credit: { author: "Wistula", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Warsaw_skyline_from_South,_2025.jpg" },
  },
  classroomVr: {
    src: classroomVr,
    alt: "Pupils in a Polish primary school classroom trying virtual-reality headsets",
    credit: { author: "Historiapomojemu", license: "CC0", licenseUrl: CC0, source: "https://commons.wikimedia.org/wiki/File:Uczniowie_Publicznej_Szko%C5%82y_Podstawowe_w_Wolanowie_podczas_zaj%C4%99%C4%87_z_wirtualn%C4%85_rzeczywisto%C5%9Bci%C4%85.jpg" },
  },
  workshopTeacher: {
    src: workshopTeacher,
    alt: "A workshop leader holds up a paper fold while children follow at their tables",
    position: "55% 40%",
    credit: { author: "Lilly M (Małgorzata Miłaszewska-Duda)", license: "CC BY-SA 3.0", licenseUrl: BYSA3, source: "https://commons.wikimedia.org/wiki/File:SOB_dni_wody_warsztaty_6.jpg" },
  },
  workshopOrigami: {
    src: workshopOrigami,
    alt: "Volunteers helping children fold origami at a community workshop",
    credit: { author: "Lilly M (Małgorzata Miłaszewska-Duda)", license: "CC BY-SA 3.0", licenseUrl: BYSA3, source: "https://commons.wikimedia.org/wiki/File:SOB_dni_wody_warsztaty_4.jpg" },
  },
  juwenaliaParade: {
    src: juwenaliaParade,
    alt: "Students in costumes marching with handmade banners during the Juwenalia student festival",
    position: "50% 35%",
    credit: { author: "Kamil Czaiński", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Bielsko-Bia%C5%82a,_Juwenalia_2025,_korow%C3%B3d,_ulica_Podcienie_04.jpg" },
  },
  juwenaliaCrowd: {
    src: juwenaliaCrowd,
    alt: "A crowd of students celebrating in an old-town street during Juwenalia",
    position: "50% 40%",
    credit: { author: "Kamil Czaiński", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Bielsko-Bia%C5%82a,_Juwenalia_2025,_korow%C3%B3d,_ulica_Podcienie_08.jpg" },
  },
  juwenaliaConcert: {
    src: juwenaliaConcert,
    alt: "A festival stage lit in blue and pink at night during Juwenalia in Wrocław",
    credit: { author: "Kamil Kulawik", license: "CC BY 4.0", licenseUrl: BY4, source: "https://commons.wikimedia.org/wiki/File:Juwenalia_Wroc%C5%82awskie_2026.jpg" },
  },
  warsawBoulevards: {
    src: warsawBoulevards,
    alt: "Crowds of people out on the Vistula boulevards in Warsaw on a summer day",
    credit: { author: "Adrian Grycuk", license: "CC BY-SA 3.0 PL", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/pl/", source: "https://commons.wikimedia.org/wiki/File:Bulwary_wi%C5%9Blane_w_Warszawie_2019a.jpg" },
  },
  krakowNight: {
    src: krakowNight,
    alt: "Kraków's Vistula boulevards at night with lights reflected in the river",
    credit: { author: "ViktoriaLi", license: "CC BY-SA 4.0", licenseUrl: BYSA4, source: "https://commons.wikimedia.org/wiki/File:Bulwary_Wi%C5%9Blane_w_Krakowie_noc%C4%85.jpg" },
  },
  exchangeThankYou: {
    src: exchangeThankYou,
    alt: "An exchange participant surrounded by laughing children holding up a hand-made card",
    position: "50% 40%",
    credit: { author: "AIESEC in Poland", license: "Used with permission", source: "https://aiesec.pl" },
  },
  exchangeTeaching: {
    src: exchangeTeaching,
    alt: "An exchange participant teaching children sitting on a classroom carpet",
    position: "50% 35%",
    credit: { author: "AIESEC in Poland", license: "Used with permission", source: "https://aiesec.pl" },
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const PROGRAM_PHOTOS: Record<Program, { primary: Photo; secondary: Photo }> = {
  igv: { primary: PHOTOS.workshopOrigami, secondary: PHOTOS.juwenaliaCrowd },
  igta: { primary: PHOTOS.warsawVistula, secondary: PHOTOS.warsawBoulevards },
  igte: { primary: PHOTOS.exchangeTeaching, secondary: PHOTOS.workshopTeacher },
};

/** Photography for known cities, keyed by city slug. */
const CITY_PHOTOS: Record<string, Photo> = {
  warsaw: PHOTOS.warsaw,
  krakow: PHOTOS.krakow,
  lodz: PHOTOS.lodz,
  poznan: PHOTOS.poznan,
  katowice: PHOTOS.katowice,
  lublin: PHOTOS.lublin,
  gdansk: PHOTOS.gdansk,
};

/**
 * Cities discovered in GIS that have no dedicated photograph get a typographic
 * treatment instead (returns undefined) — we never show the wrong city.
 */
export function cityPhoto(slug?: string): Photo | undefined {
  return slug ? CITY_PHOTOS[slug] : undefined;
}

export const ALL_PHOTOS: Photo[] = Object.values(PHOTOS);
