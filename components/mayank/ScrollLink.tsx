"use client";

import type { ReactNode } from "react";
import { scrollToElement } from "@/lib/scroll";

export function ScrollLink({ target, className, children }: { target: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(event) => {
        const element = document.getElementById(target);
        if (!element) return;
        event.preventDefault();
        scrollToElement(element);
        window.history.replaceState(null, "", `#${target}`);
      }}
    >
      {children}
    </a>
  );
}
