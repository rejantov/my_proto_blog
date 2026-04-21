import { GraduationCap, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
        
        {education?.map((item, index) => (
          <div key={item.id} className="relative pl-20 pb-12 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute left-6 top-0 w-5 h-5 rounded-full bg-primary border-4 border-background animate-pulse-glow" />
            
            {/* Content card */}
            <article className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {item.institution}
                  </h3>
                  <p className="text-primary font-mono text-sm">
                    {item.degree} in {item.field}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                  <Calendar className="h-4 w-4" />
                  {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : "Present"}
                </div>
              </div>
              
              {/* Description */}
              {item.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}
