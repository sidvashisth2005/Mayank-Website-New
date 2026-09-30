"use client";

import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { TransitionLink } from "../PageTransition";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/listings", label: "Listings" },
  { href: "/dashboard/enquiries", label: "Enquiries" },
  { href: "/dashboard/saved", label: "Saved" },
  { href: "/dashboard/settings", label: "Settings" },
];

// Left rail on desktop, a scrolling tab strip on phones.
export function DeskNav({ isAdmin, counts }: { isAdmin: boolean; counts: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  const current = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  return (
    <nav className="desk-nav" aria-label="Desk">
      <ol>
        {links.map((link, index) => (
          <li key={link.href}>
            <TransitionLink href={link.href} aria-current={current(link.href) ? "page" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>{link.label}
              {counts[link.href] ? <b aria-label={`${counts[link.href]} need attention`}>{counts[link.href]}</b> : null}
            </TransitionLink>
          </li>
        ))}
        {isAdmin && (
          <li className="desk-nav-admin">
            <TransitionLink href="/admin" aria-current={pathname.startsWith("/admin") ? "page" : undefined}><span>RD</span>Review desk</TransitionLink>
          </li>
        )}
      </ol>
      <SignOutButton redirectUrl="/"><button type="button" className="desk-signout">Sign out</button></SignOutButton>
    </nav>
  );
}
