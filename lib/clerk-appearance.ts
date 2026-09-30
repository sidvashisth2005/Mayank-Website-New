// Clerk's sign-in, sign-up and account screens dressed in the Mayank ledger:
// paper and ink, square corners, ruled lines, mono labels and no shadows.

const display = '"Instrument Sans Variable", "Helvetica Neue", sans-serif';
const mono = '"IBM Plex Mono", ui-monospace, Menlo, monospace';

export const clerkAppearance = {
  variables: {
    colorPrimary: "#101111",
    colorPrimaryForeground: "#f7f7f5",
    colorBackground: "#f7f7f5",
    colorForeground: "#101111",
    colorMutedForeground: "#4c4e49",
    colorMuted: "#ededeb",
    colorInput: "#f7f7f5",
    colorInputForeground: "#101111",
    colorBorder: "rgba(16, 17, 17, .32)",
    colorDanger: "#8c3a2b",
    colorSuccess: "#5D6B3C",
    colorShadow: "transparent",
    colorRing: "#101111",
    colorModalBackdrop: "rgba(16, 17, 17, .72)",
    fontFamily: display,
    fontFamilyButtons: mono,
    fontFamilyMono: mono,
    fontSize: "0.95rem",
    borderRadius: "0",
  },
  elements: {
    rootBox: { width: "100%" },
    cardBox: { width: "100%", maxWidth: "none", boxShadow: "none", border: "1px solid #101111", borderRadius: 0 },
    card: { boxShadow: "none", borderRadius: 0, padding: "2rem 1.75rem" },
    headerTitle: { fontSize: "1.9rem", fontWeight: 560, letterSpacing: "-0.05em" },
    headerSubtitle: { color: "#4c4e49" },
    formFieldLabel: { fontFamily: mono, fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" },
    formFieldInput: { boxShadow: "none", border: 0, borderBottom: "1px solid #101111", borderRadius: 0, paddingLeft: 0, fontSize: "1.05rem" },
    formButtonPrimary: { boxShadow: "none", minHeight: "3.2rem", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" },
    socialButtonsBlockButton: { boxShadow: "none", border: "1px solid #101111", minHeight: "3rem" },
    dividerLine: { background: "rgba(16, 17, 17, .32)" },
    footer: { background: "#ededeb", borderTop: "1px solid #101111" },
    footerAction: { fontSize: "0.85rem" },
  },
} as const;
