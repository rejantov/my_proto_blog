"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 22px",
  borderRadius: 999,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.25s",
  color: "rgba(255,255,255,0.75)",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(6px)",
  letterSpacing: "0.01em",
}

const active: React.CSSProperties = {
  ...base,
  color: "#f0e6ff",
  background: "rgba(168,85,247,0.14)",
  border: "1px solid rgba(192,132,252,0.35)",
  boxShadow: "0 0 16px rgba(168,85,247,0.25), inset 0 0 12px rgba(168,85,247,0.08)",
}


export function PortfolioHeader() {
  const pathname = usePathname()

  const isPortfolio = pathname === "/" || pathname.startsWith("/portfolio")
  const isBlog = pathname.startsWith("/blog")

  return (
    <div
      className="porto-header-wrap fixed top-0 left-0 right-0 z-50 flex items-center justify-between pointer-events-none"
      style={{ padding: "18px 32px" }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="pointer-events-auto porto-logo"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.9)",
          textDecoration: "none",
        }}
      >
        <span style={{ color: "#a855f7", filter: "drop-shadow(0 0 8px rgba(168,85,247,0.8))" }}>&gt;_</span>
        <span style={{ color: "rgba(255,255,255,0.45)", margin: "0 6px" }}>&gt;</span>
        <span>my_porto_blog</span>
      </Link>

      {/* Buttons */}
      <div className="pointer-events-auto flex items-center" style={{ gap: 14 }}>
        <Link href="/" className="porto-nav-link" style={isPortfolio ? active : base}>
          ./portfolio
        </Link>
        <Link href="/blog" className="porto-nav-link" style={isBlog ? active : base}>
          ./blog
        </Link>
      </div>
    </div>
  )
}
