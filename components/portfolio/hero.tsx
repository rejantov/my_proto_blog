import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
}

export async function Hero() {
  const supabase = await createClient()
  
  const [{ data: profile }, { data: socialLinks }] = await Promise.all([
    supabase.from("profile").select("*").single(),
    supabase.from("social_links").select("*").order("display_order"),
  ])
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Subtle gradient background - no grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-fuchsia-950/10" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Terminal-style header */}
        <div className="inline-block mb-8">
          <div className="bg-card/80 backdrop-blur border-2 border-purple-500/50 rounded-lg overflow-hidden neon-glow">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 border-b border-purple-500/50">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-purple-300 font-mono">terminal</span>
            </div>
            <div className="px-6 py-4 font-mono text-sm text-left">
              <p className="text-purple-400">
                <span className="text-fuchsia-400">$</span> whoami
              </p>
              <p className="text-white mt-1 neon-text">
                {profile?.name || "Anonymous Hacker"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          <span className="text-white">{profile?.name?.split(" ")[0] || "Cyber"}</span>
          <span className="text-fuchsia-400 neon-text"> {profile?.name?.split(" ").slice(1).join(" ") || "Dev"}</span>
        </h1>
        
        {/* Title with neon effect */}
        <p className="text-xl md:text-2xl text-purple-400 font-mono mb-6 neon-text-pink">
          {profile?.title || "Full Stack Developer"}
        </p>
        
        {/* Bio */}
        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          {profile?.bio || "Loading bio..."}
        </p>
        
        {/* Social links */}
        <div className="flex items-center justify-center gap-4">
          {socialLinks?.map((link) => {
            const Icon = iconMap[link.icon] || Mail
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border-2 border-purple-500/50 bg-purple-900/20 hover:border-fuchsia-400 hover:bg-purple-800/30 hover:neon-glow transition-all group"
                aria-label={link.platform}
              >
                <Icon className="h-5 w-5 text-purple-300 group-hover:text-fuchsia-400 transition-colors" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
