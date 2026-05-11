import { GraduationCap, Calendar } from "lucide-react"
import { marked } from "marked"
import { createClient } from "@/lib/supabase/server"

function getDegreeTag(degree: string): { label: string; className: string } {
  const d = degree.toLowerCase()
  if (d.includes("high school") || d.includes("secondary") || d.includes("diploma")) {
    return { label: "High School", className: "bg-slate-500/20 text-slate-300 border-slate-500/40" }
  }
  if (d.includes("phd") || d.includes("ph.d") || d.includes("doctor")) {
    return { label: "PhD", className: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40" }
  }
  if (d.includes("master") || d.includes("m.s.") || d.includes("m.a.") || d.includes("msc")) {
    return { label: "Master", className: "bg-primary/20 text-primary border-primary/40" }
  }
  if (d.includes("bachelor") || d.includes("b.s.") || d.includes("b.a.") || d.includes("bsc")) {
    return { label: "Bachelor", className: "bg-blue-500/20 text-blue-300 border-blue-500/40" }
  }
  if (d.includes("associate") || d.includes("a.a.") || d.includes("a.s.")) {
    return { label: "Associate", className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" }
  }
  if (d.includes("certificate") || d.includes("certification") || d.includes("professional")) {
    return { label: "Certificate", className: "bg-green-500/20 text-green-300 border-green-500/40" }
  }
  if (d.includes("bootcamp") || d.includes("program") || d.includes("course")) {
    return { label: "Program", className: "bg-orange-500/20 text-orange-300 border-orange-500/40" }
  }
  return { label: "Education", className: "bg-primary/20 text-primary border-primary/40" }
}

export async function Education() {
  const supabase = await createClient()
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-border" />

        {education?.map((item) => {
          const tag = getDegreeTag(item.degree)
          return (
            <div key={item.id} className="relative pl-14 sm:pl-20 pb-12 last:pb-0">
              {/* Timeline dot */}
              <div className="absolute left-4 sm:left-6 top-0 w-5 h-5 rounded-full bg-primary border-4 border-background animate-pulse-glow" />

              {/* Content card */}
              <article className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-all">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-4 mb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-xl font-bold text-foreground leading-tight">{item.institution}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono border ${tag.className}`}>
                        {tag.label}
                      </span>
                    </div>
                    <p className="text-primary font-mono text-xs sm:text-sm leading-snug">
                      {item.degree} in {item.field}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm font-mono shrink-0">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {formatDate(item.start_date)} — {item.end_date ? formatDate(item.end_date) : <span className="text-green-500">Present</span>}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div
                    className="md-content text-muted-foreground text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: marked.parse(item.description) as string }}
                  />
                )}
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}
