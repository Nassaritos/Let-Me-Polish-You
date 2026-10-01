"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/site";

/** Program pages are underlined in their product colour. */
const UNDERLINE: Record<string, string> = {
  "/global-volunteer": "bg-gv",
  "/global-talent": "bg-gta",
  "/global-teacher": "bg-gte",
};
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Arrow } from "@/components/ui/Arrow";

export function SiteNav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  // Close the menu when the route changes (state adjustment during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.08),0_10px_30px_-20px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        <nav aria-label="Main" className="frame flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="relative z-[60] shrink-0" aria-label="Let Me Polish You — home">
            <BrandLogo width={64} priority />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 font-display text-[0.86rem] font-bold transition-colors hover:text-red-ink ${
                    isActive(l.href) ? (UNDERLINE[l.href] ? "text-ink" : "text-red-ink") : "text-ink"
                  }`}
                >
                  {l.label}
                  {isActive(l.href) && <span className={`absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full ${UNDERLINE[l.href] ?? "bg-red"}`} aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/opportunities" className="btn btn-red hidden !px-5 !py-3 text-[0.9rem] sm:inline-flex">
              All opportunities <Arrow />
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-xl bg-ink text-white lg:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-[2.5px] w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[2.5px] w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[55] flex flex-col bg-white px-[var(--gutter)] pb-8 pt-24 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow text-grey">Choose your experience</p>
            <ul className="mt-3 flex-1 space-y-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.04 }}>
                  {i === 3 && <hr className="my-4 border-line" />}
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`display block py-2 text-[2rem] ${isActive(l.href) ? "text-red-ink" : ""}`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link href="/opportunities" onClick={() => setOpen(false)} className="btn btn-red w-full !py-5 text-lg">
              See all opportunities <Arrow />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
