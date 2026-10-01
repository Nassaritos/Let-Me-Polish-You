import type { Program } from "@/lib/programs";
import { PROGRAM_ICON } from "@/lib/program-style";

export function ProgramIcon({ program, className = "" }: { program: Program; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PROGRAM_ICON[program]} />
    </svg>
  );
}
