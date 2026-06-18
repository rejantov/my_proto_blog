import { Calendar } from "lucide-react"
import { marked } from "marked"
import { createPublicClient as createClient } from "@/lib/supabase/public"

const cardStyle: React.CSSProperties = {
  background: "rgba(18,10,28,0.65)",
  border: "1px solid rgba(192,132,252,0.18)",
  borderRadius: 16,
  backdropFilter: "blur(4px)",
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
        style={{ left: 11, width: 1, background: "rgba(192,132,252,0.2)", zIndex: 1 }}
      />

      <div className="space-y-5">
        {education.map((item: any) => (
            <div key={item.id} className="relative pl-10">
              {/* Circle dot */}
              <div
                className="absolute porto-timeline-dot"
                style={{
                  left: 4, top: 20, width: 15, height: 15,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(192,132,252,0.9)",
                  background: "#06030e",
                  zIndex: 2,
                }}
              />

              <article style={cardStyle} className="p-6 transition-all duration-300 hover:border-primary/40">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-foreground leading-tight mb-1">{item.institution}</h3>
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
        )}
      </div>
    </div>
  )
}
