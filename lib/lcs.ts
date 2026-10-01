import type { StaticImageData } from "next/image";
import gdansk from "@/public/brand/lcs/gdansk.png";
import katowice from "@/public/brand/lcs/katowice.png";
import krakow from "@/public/brand/lcs/krakow.png";
import lodz from "@/public/brand/lcs/lodz.png";
import lublin from "@/public/brand/lcs/lublin.png";
import poznan from "@/public/brand/lcs/poznan.png";
import rzeszow from "@/public/brand/lcs/rzeszow.png";
import szczecin from "@/public/brand/lcs/szczecin.png";
import warsawSgh from "@/public/brand/lcs/warsaw-sgh.png";
import warsawUw from "@/public/brand/lcs/warsaw-uw.png";
import wroclawUe from "@/public/brand/lcs/wroclaw-ue.png";
import wroclawUt from "@/public/brand/lcs/wroclaw-ut.png";

/**
 * AIESEC in Poland local committees (LCs) and their campaign logos.
 * `gis` lists the committee names GIS uses, so an opportunity's host_lc can
 * be matched to its logo.
 */
export interface LocalCommittee {
  key: string;
  name: string;
  city: string;
  tagline: string;
  logo: StaticImageData;
  gis: string[];
}

export const LOCAL_COMMITTEES: LocalCommittee[] = [
  { key: "warsaw-sgh", name: "Warsaw SGH", city: "Warsaw", tagline: "taste of cebula", logo: warsawSgh, gis: ["warszawa sgh", "warsaw sgh"] },
  { key: "warsaw-uw", name: "Warsaw UW", city: "Warsaw", tagline: "city of delights", logo: warsawUw, gis: ["warsaw uw", "warszawa uw"] },
  { key: "krakow", name: "Kraków", city: "Kraków", tagline: "city of kings", logo: krakow, gis: ["krakow"] },
  { key: "gdansk", name: "Gdańsk", city: "Gdańsk", tagline: "city of freedom", logo: gdansk, gis: ["gdansk ug", "gdansk"] },
  { key: "poznan", name: "Poznań", city: "Poznań", tagline: "unbreakable youth", logo: poznan, gis: ["poznan"] },
  { key: "lodz", name: "Łódź", city: "Łódź", tagline: "diver city", logo: lodz, gis: ["lodz"] },
  { key: "wroclaw-ue", name: "Wrocław UE", city: "Wrocław", tagline: "na bogato", logo: wroclawUe, gis: ["wroclaw ue"] },
  { key: "wroclaw-ut", name: "Wrocław UT", city: "Wrocław", tagline: "city of 100 bridges", logo: wroclawUt, gis: ["wroclaw ut"] },
  { key: "katowice", name: "Katowice", city: "Katowice", tagline: "mine COOLa", logo: katowice, gis: ["katowice ue", "katowice"] },
  { key: "lublin", name: "Lublin", city: "Lublin", tagline: "power of youth", logo: lublin, gis: ["lublin umcs", "lublin"] },
  { key: "rzeszow", name: "Rzeszów", city: "Rzeszów", tagline: "monumental and real experience", logo: rzeszow, gis: ["rzeszow"] },
  { key: "szczecin", name: "Szczecin", city: "Szczecin", tagline: "let me paprykarz you", logo: szczecin, gis: ["szczecin"] },
];

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/gi, "l")
    .toLowerCase()
    .replace(/^aiesec in\s+/, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Match a GIS host committee name ("WARSZAWA SGH", "AIESEC in LODZ") to an LC. */
export function lcFromGisName(name?: string): LocalCommittee | undefined {
  if (!name) return undefined;
  const n = norm(name);
  return LOCAL_COMMITTEES.find((lc) => lc.gis.includes(n));
}

export function lcByKey(key?: string): LocalCommittee | undefined {
  return key ? LOCAL_COMMITTEES.find((lc) => lc.key === key) : undefined;
}
