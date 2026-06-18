"use client"

import { useRouter } from "next/navigation"

interface ProjectCardProps {
  slug: string | null
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function ProjectCard({ slug, className, style, children }: ProjectCardProps) {
  const router = useRouter()

  return (
    <article
      className={className}
      style={{ ...style, cursor: slug ? "pointer" : "default" }}
      onClick={(e) => {
        if (!slug) return
        // Don't navigate if the click came from an inner link or button
        if ((e.target as HTMLElement).closest("a, button")) return
        router.push(`/projects/${slug}`)
      }}
    >
      {children}
    </article>
  )
}
