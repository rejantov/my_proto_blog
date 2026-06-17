import { Calendar, MapPin } from "lucide-react"
import { marked } from "marked"
import { createClient } from "@/lib/supabase/server"

const cardStyle: React.CSSProperties = {
  background: "rgba(18,10,28,0.65)",
  border: "1px solid rgba(192,132,252,0.18)",
  borderRadius: 16,
  backdropFilter: "blur(4px)",
}

export async function Experience() {
  const supabase = await createClient()
  const { data: experience } = await supabase
    .from("work_experience")
    .select("*")
    .order("start_date", { ascending: false })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" })

  if (!experience || experience.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 text-muted-foreground font-mono text-sm">
        No experience entries yet.
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
        {experience.map((item) => (
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
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-foreground leading-tight">{item.company}</h3>
                    {item.employment_type && (
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-md"
                        style={{
                          border: "1px solid rgba(192,132,252,0.25)",
                          background: "rgba(168,85,247,0.1)",
                          color: "#d8b4fe",
                        }}
                      >
                        {item.employment_type}
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-mono text-sm">{item.role}</p>
                  {item.location && (
                    <p className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono mt-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </p>
                  )}
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs font-mono shrink-0"
                  style={{ color: "#a99fbd" }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(item.start_date)} —{" "}
                  {item.is_current || !item.end_date ? (
                    <span className="text-green-400">Present</span>
                  ) : (
                    formatDate(item.end_date)
                  )}
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
        ))}
      </div>
    </div>
  )
}
