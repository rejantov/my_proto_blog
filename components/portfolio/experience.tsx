import { Calendar, MapPin } from "lucide-react"
import { marked } from "marked"
import { createClient } from "@/lib/supabase/server"

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
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-border" />

        {experience.map((item) => (
          <div key={item.id} className="relative pl-14 sm:pl-20 pb-12 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute left-4 sm:left-6 top-0 w-5 h-5 rounded-full bg-primary border-4 border-background animate-pulse-glow" />

            <article className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-foreground leading-tight">{item.company}</h3>
                  <p className="text-primary font-mono text-xs sm:text-sm">{item.role}</p>
                  {item.location && (
                    <p className="flex items-center gap-1 text-muted-foreground text-xs font-mono mt-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm font-mono shrink-0">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {formatDate(item.start_date)} —{" "}
                  {item.is_current || !item.end_date ? (
                    <span className="text-green-500">Present</span>
                  ) : (
                    formatDate(item.end_date)
                  )}
                </div>
              </div>

              {item.description && (
                <div
                  className="md-content text-muted-foreground text-sm leading-relaxed"
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
