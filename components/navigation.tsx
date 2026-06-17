"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Terminal, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isPortfolio = pathname === "/" || pathname.startsWith("/portfolio")
  const isBlog = pathname.startsWith("/blog")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b bg-background/70 border-border">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Terminal className="h-5 w-5 text-primary" />
            <span className="font-mono text-base font-bold tracking-tight">
              <span className="text-primary">&gt;</span> my_porto_blog
            </span>
          </Link>

          {/* Right: nav links + theme toggle + mobile button */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="hidden md:inline-flex px-4 py-2 font-mono text-sm transition-colors"
              style={{ color: isPortfolio ? "#f0e6ff" : "#a99fbd" }}
            >
              ./portfolio
            </Link>
            <Link
              href="/blog"
              className="hidden md:inline-flex px-4 py-2 font-mono text-sm transition-colors"
              style={{ color: isBlog ? "#f0e6ff" : "#a99fbd" }}
            >
              ./blog
            </Link>

            <ThemeToggle />

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderColor: "rgba(192,132,252,0.12)" }}
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 font-mono text-sm transition-colors"
                style={{ color: isPortfolio ? "#f0e6ff" : "#a99fbd" }}
              >
                ./portfolio
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 font-mono text-sm transition-colors"
                style={{ color: isBlog ? "#f0e6ff" : "#a99fbd" }}
              >
                ./blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
