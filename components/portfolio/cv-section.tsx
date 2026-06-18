import { Download, FileText } from "lucide-react"
import { createPublicClient as createClient } from "@/lib/supabase/public"

export async function CVSection() {
  const supabase = await createClient()

  const [{ data: profile }, { data: activeResume }] = await Promise.all([
    supabase.from("profile").select("name, title").single(),
    supabase.from("resumes").select("url, filename").eq("is_active", true).maybeSingle(),
  ])

  return (
    <div className="max-w-xl mx-auto">
      {/* CV Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-10 text-center"
        style={{
          background: "rgba(18,10,28,0.7)",
          border: "1px solid rgba(192,132,252,0.18)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "60%", height: 120,
            background: "radial-gradient(ellipse at center, rgba(168,85,247,0.28), transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        <div className="relative">
          {/* Icon */}
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl grid place-items-center"
            style={{
              border: "1px solid rgba(192,132,252,0.35)",
              background: "rgba(168,85,247,0.1)",
              boxShadow: "0 0 30px rgba(168,85,247,0.3)",
            }}
          >
            <FileText className="h-9 w-9 text-primary" />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">
            {profile?.name || "Resume"} &mdash; CV
          </h3>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "#a99fbd" }}
          >
            {profile?.title || "Full Stack Developer"} &middot; Full résumé with detailed experience, education, and project history.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {activeResume ? (
              <a
                href={activeResume.url}
                download
                className="porto-cv-btn flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm"
                style={{
                  border: "1px solid rgba(192,132,252,0.6)",
                  background: "rgba(168,85,247,0.18)",
                  color: "#f0e6ff",
                  boxShadow: "0 0 26px rgba(168,85,247,0.35)",
                }}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            ) : (
              <div
                className="px-6 py-3 rounded-xl font-mono text-sm"
                style={{
                  border: "1px solid rgba(192,132,252,0.12)",
                  color: "#6f6385",
                }}
              >
                Resume not uploaded yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview */}
      {activeResume && (
        <div
          className="rounded-2xl overflow-hidden mt-6"
          style={{
            border: "1px solid rgba(192,132,252,0.18)",
            background: "rgba(18,10,28,0.65)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "rgba(192,132,252,0.12)", background: "rgba(168,85,247,0.06)" }}
          >
            <span className="text-xs text-muted-foreground font-mono">{activeResume.filename}</span>
            <a
              href={activeResume.url}
              download
              className="flex items-center gap-1 text-xs text-primary font-mono hover:underline"
            >
              <Download className="h-3 w-3" />
              Download
            </a>
          </div>
          <iframe
            src={activeResume.url}
            className="w-full"
            style={{ height: 700 }}
            title="Resume preview"
          />
        </div>
      )}
    </div>
  )
}
