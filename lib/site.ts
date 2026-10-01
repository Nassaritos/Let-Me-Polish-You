export const SITE = {
  name: "Let Me Polish You",
  tagline: "Live opportunities hosted by AIESEC in Poland",
  description:
    "Volunteer, intern or teach in Poland with AIESEC. Explore live Global Volunteer, Global Talent and Global Teacher opportunities hosted by AIESEC in Poland.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

export const NAV_LINKS = [
  { href: "/global-volunteer", label: "Global Volunteer" },
  { href: "/global-talent", label: "Global Talent" },
  { href: "/global-teacher", label: "Global Teacher" },
  { href: "/poland", label: "Life in Poland" },
  { href: "/about", label: "What's AIESEC?" },
] as const;

/** Official AIESEC in Poland channels (as linked from aiesec.pl). */
export const EXTERNAL = {
  aiesecPoland: "https://aiesec.pl",
  aiesecGlobal: "https://aiesec.org",
  aiesecAbout: "https://aiesec.org/about-us",
} as const;

export const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/aiesecpolska/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/aiesec-polska/" },
  { label: "Facebook", href: "https://www.facebook.com/aiesecpoland" },
  { label: "TikTok", href: "https://www.tiktok.com/@aiesecpoland" },
  { label: "YouTube", href: "https://www.youtube.com/user/AIESECPolska" },
] as const;
