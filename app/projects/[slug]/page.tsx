export const revalidate = 120

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Star } from "lucide-react"
import { createPublicClient as createClient } from "@/lib/supabase/public"
import { parseMarkdown } from "@/lib/markdown"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single()

  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  }
}

const cardStyle: React.CSSProperties = {
  background: "rgba(18,10,28,0.65)",
  border: "1px solid rgba(192,132,252,0.18)",
  borderRadius: 16,
  backdropFilter: "blur(4px)",
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!project) notFound()

  const htmlContent = project.content ? parseMarkdown(project.content) : null

  return (
    <div className="porto-bg min-h-screen">

      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-50 px-5 py-4 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm transition-all hover:border-primary/50"
          style={{
            background: "rgba(18,10,28,0.85)",
            border: "1px solid rgba(192,132,252,0.22)",
            color: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-20 pb-20">

        {/* Hero image */}
        {project.image_url && (
          <div
            className="w-full overflow-hidden mb-8"
            style={{
              height: 340,
              borderRadius: 16,
              border: "1px solid rgba(192,132,252,0.2)",
            }}
          >
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Project header card */}
        <div style={cardStyle} className="p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-3xl font-bold text-foreground leading-tight">{project.title}</h1>
            {project.featured && (
              <span
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono shrink-0 mt-1"
                style={{
                  border: "1px solid rgba(192,132,252,0.3)",
                  background: "rgba(168,85,247,0.12)",
                  color: "#d8b4fe",
                }}
              >
                <Star className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-5">{project.description}</p>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {project.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-xs font-mono"
                  style={{
                    border: "1px solid rgba(192,132,252,0.22)",
                    background: "rgba(168,85,247,0.07)",
                    color: "#c3b6d8",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-5">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                Code
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Markdown content */}
        {htmlContent && (
          <div style={cardStyle} className="p-6 md:p-8">
            <div
              className="project-content prose prose-invert max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:text-muted-foreground
                prose-blockquote:border-l-primary/50 prose-blockquote:text-muted-foreground
                prose-img:rounded-xl prose-img:border prose-img:border-primary/20"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
