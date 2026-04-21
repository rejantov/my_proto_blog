import { Download, FileText, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function CVSection() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profile").select("*").single()
  
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* CV Preview Card */}
      <div className="bg-card border border-border rounded-lg p-8 mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {profile?.name || "Your Name"}
        </h3>
        <p className="text-primary font-mono mb-4">
          {profile?.title || "Your Title"}
        </p>
        
        <p className="text-muted-foreground mb-8">
          Download my resume to learn more about my experience, skills, and qualifications.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {profile?.resume_url ? (
            <>
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-mono text-sm hover:bg-secondary/80 transition-all"
              >
                <Eye className="h-4 w-4" />
                View Resume
              </a>
              <a
                href={profile.resume_url}
                download
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono text-sm hover:neon-glow transition-all"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </>
          ) : (
            <div className="px-6 py-3 bg-secondary/50 text-muted-foreground rounded-lg font-mono text-sm">
              Resume not uploaded yet
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-primary mb-1">5+</div>
          <div className="text-xs text-muted-foreground font-mono">Years Experience</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-primary mb-1">20+</div>
          <div className="text-xs text-muted-foreground font-mono">Projects Completed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-3xl font-bold text-primary mb-1">10+</div>
          <div className="text-xs text-muted-foreground font-mono">Technologies</div>
        </div>
      </div>
    </div>
  )
}
