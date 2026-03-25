import { Link } from 'react-router-dom'

import { site } from '@/data/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium">{site.name}</p>
          <p className="mt-1 max-w-md text-sm text-[var(--muted-foreground)]">
            {site.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
          <Link
            to="/about"
            className="hover:text-[var(--foreground)]"
          >
            About
          </Link>
          <Link to="/lab" className="hover:text-[var(--foreground)]">
            Lab
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="hover:text-[var(--foreground)]"
          >
            Email
          </a>
          <a
            href="https://github.com/mehditareghi"
            className="hover:text-[var(--foreground)]"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] sm:text-right">
          © {year} {site.author}
        </p>
      </div>
    </footer>
  )
}
