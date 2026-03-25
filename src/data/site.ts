export const site = {
  name: "Mehdi Lab",
  /** Legal / attribution name */
  author: "Mehdi Tareghi",
  /** Public contact (mailto) */
  email: "mehditareghi@gmail.com",
  tagline: "Surface, motion, and small experiments.",
  description:
    "A creative digital playground — part lab, part portfolio, part toy I keep improving.",
  /** Used by the header star widget (ghbtns). Set to your GitHub user + repo name. */
  github: {
    user: "mehditareghi",
    repo: "mehdilab",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Lab" },
  { href: "/showcase", label: "Showcase" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
] as const;
