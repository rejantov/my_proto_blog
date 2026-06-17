import { ExternalLink, Github, Star } from "lucide-react"
import { marked } from "marked"
import { createClient } from "@/lib/supabase/server"

export async function Projects() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground font-mono text-sm">
        No projects yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, idx) => (
        <article
          key={project.id}
          className="porto-card group relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(18,10,28,0.65)",
            border: "1px solid rgba(192,132,252,0.18)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Top glow accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent)" }}
          />

          {/* Project image */}
          <div className="h-44 overflow-hidden flex items-center justify-center border-b"
            style={{ background: "rgba(168,85,247,0.06)", borderColor: "rgba(192,132,252,0.12)" }}>
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <span className="text-5xl font-mono text-primary/20 group-hover:text-primary/40 transition-colors select-none">
                {"</>"}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary/50">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {project.title}
                </h3>
              </div>
              {project.featured && (
                <span
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono shrink-0"
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

            {/* Description */}
            <div
              className="md-content text-muted-foreground text-sm leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: marked.parse(project.description ?? "") as string }}
            />

            {/* Tech stack */}
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

            {/* Links */}
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
        </article>
      ))}
    </div>
  )
}
