"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { AiesecLogo } from "@/components/brand/AiesecLogo";
import { Arrow } from "@/components/ui/Arrow";

export function SiteNav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  // Close the menu when the route changes (state adjustment during render, no effect needed).
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

  const solid = scrolled && !open;
  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300 ${
          solid ? "on-light bg-white/95 text-navy shadow-[0_1px_0_rgba(10,31,68,0.08)] backdrop-blur-md" : "text-white"
        }`}
      >
        <nav aria-label="Main" className="frame flex h-[4.25rem] items-center justify-between gap-6">
          <Link href="/" className="relative z-[60] flex items-center gap-3" aria-label="Let Me Polish You — home">
            <AiesecLogo tone={solid ? "blue" : "white"} width={104} />
            <span className="hidden h-6 w-px bg-current opacity-30 sm:block" aria-hidden="true" />
            <span className="hidden font-display text-[0.95rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:block">
              Let me
              <br />
              Polish you
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`rounded-full px-4 py-2 font-display text-[0.95rem] font-bold transition-colors ${
                    solid ? "hover:bg-blue-soft" : "hover:bg-white/15"
                  } ${isActive(l.href) ? (solid ? "bg-blue-soft" : "bg-white/15") : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/opportunities" className={`btn hidden !px-5 !py-3 text-[0.92rem] sm:inline-flex ${solid ? "btn-primary" : "btn-yellow !shadow-none"}`}>
              Find your opportunity <Arrow />
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`relative z-[60] grid h-11 w-11 place-items-center rounded-full md:hidden ${
                open ? "bg-white text-navy" : solid ? "bg-navy text-white" : "bg-white/15 text-white"
              }`}
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
            className="fixed inset-0 z-[55] flex flex-col bg-blue px-[var(--gutter)] pb-8 pt-24 text-white md:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex-1 space-y-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display block py-2 text-[2.6rem]"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="hand mb-4 text-2xl text-yellow">Cześć! Ready when you are.</p>
            <Link href="/opportunities" onClick={() => setOpen(false)} className="btn btn-yellow w-full !py-5 text-lg">
              Find your opportunity <Arrow />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
