import { Calendar } from "lucide-react"
import { marked } from "marked"
import { createClient } from "@/lib/supabase/server"

const cardStyle: React.CSSProperties = {
  background: "rgba(18,10,28,0.65)",
  border: "1px solid rgba(192,132,252,0.18)",
  borderRadius: 16,
  backdropFilter: "blur(4px)",
}

function getDegreeTag(degree: string): { label: string; color: string } {
  const d = degree.toLowerCase()
  if (d.includes("high school") || d.includes("secondary") || d.includes("diploma"))
    return { label: "High School", color: "rgba(148,163,184,0.8)" }
  if (d.includes("phd") || d.includes("ph.d") || d.includes("doctor"))
    return { label: "PhD", color: "rgba(240,171,252,0.9)" }
  if (d.includes("master") || d.includes("m.s.") || d.includes("msc"))
    return { label: "Master", color: "rgba(192,132,252,0.9)" }
  if (d.includes("bachelor") || d.includes("b.s.") || d.includes("bsc"))
    return { label: "Bachelor", color: "rgba(147,197,253,0.9)" }
  if (d.includes("associate"))
    return { label: "Associate", color: "rgba(103,232,249,0.9)" }
  if (d.includes("certificate") || d.includes("certification"))
    return { label: "Certificate", color: "rgba(134,239,172,0.9)" }
  if (d.includes("bootcamp") || d.includes("program") || d.includes("course"))
    return { label: "Program", color: "rgba(253,186,116,0.9)" }
  return { label: "Education", color: "rgba(192,132,252,0.9)" }
}

export async function Education() {
  const supabase = await createClient()
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .order("start_date", { ascending: false })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" })

  if (!education || education.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 text-muted-foreground font-mono text-sm">
        No education entries yet.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Vertical timeline line */}
      <div
        className="absolute top-3 bottom-3"
        style={{ left: 11, width: 1, background: "rgba(192,132,252,0.2)" }}
      />

      <div className="space-y-5">
        {education.map((item) => {
          const tag = getDegreeTag(item.degree)
          return (
            <div key={item.id} className="relative pl-10">
              {/* Circle dot */}
              <div
                className="absolute"
                style={{
                  left: 5, top: 22, width: 13, height: 13,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(192,132,252,0.6)",
                  background: "rgba(168,85,247,0.12)",
                }}
              />

              <article style={cardStyle} className="p-6 transition-all duration-300 hover:border-primary/40">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground leading-tight">{item.institution}</h3>
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-md"
                        style={{
                          border: `1px solid ${tag.color.replace("0.8", "0.3").replace("0.9", "0.3")}`,
                          background: tag.color.replace("0.8", "0.1").replace("0.9", "0.1"),
                          color: tag.color,
                        }}
                      >
                        {tag.label}
                      </span>
                    </div>
                    <p className="text-primary font-mono text-sm leading-snug">
                      {item.degree} in {item.field}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-xs font-mono shrink-0"
                    style={{ color: "#a99fbd" }}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(item.start_date)} —{" "}
                    {item.end_date ? formatDate(item.end_date) : <span className="text-green-400">Present</span>}
                  </div>
                </div>

                {item.description && (
                  <div
                    className="md-content text-muted-foreground text-sm leading-relaxed mt-3 pt-3 border-t"
                    style={{ borderColor: "rgba(192,132,252,0.1)" }}
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
