export const revalidate = 120 // re-render at most every 2 minutes

import { Hero } from "@/components/portfolio/hero"
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs"
import { Projects } from "@/components/portfolio/projects"
import { Experience } from "@/components/portfolio/experience"
import { Education } from "@/components/portfolio/education"
import { Certifications } from "@/components/portfolio/certifications"
import { CVSection } from "@/components/portfolio/cv-section"
import { PortfolioHeader } from "@/components/portfolio/portfolio-header"

type BeamProps = {
  left: string
  rotateDeg: number
  color: string
  glowColor: string
  height: string
  coreW: number
  delay: string
  duration: string
}

const BEAMS: BeamProps[] = [
  { left: "8%",  rotateDeg: -32, color: "rgba(168,85,247,0.9)",  glowColor: "rgba(168,85,247,0.25)",  height: "62vh", coreW: 3, delay: "0s",    duration: "5s"   },
  { left: "24%", rotateDeg: -16, color: "rgba(217,70,239,0.85)", glowColor: "rgba(217,70,239,0.22)",  height: "70vh", coreW: 2, delay: "1.3s",  duration: "4.5s" },
  { left: "44%", rotateDeg: -3,  color: "rgba(192,132,252,0.9)", glowColor: "rgba(192,132,252,0.28)", height: "75vh", coreW: 4, delay: "0.7s",  duration: "6s"   },
  { left: "64%", rotateDeg: 14,  color: "rgba(236,72,153,0.8)",  glowColor: "rgba(236,72,153,0.2)",   height: "65vh", coreW: 2, delay: "2.1s",  duration: "5.5s" },
  { left: "82%", rotateDeg: 28,  color: "rgba(168,85,247,0.85)", glowColor: "rgba(168,85,247,0.22)",  height: "58vh", coreW: 3, delay: "1.6s",  duration: "5s"   },
]

export default function HomePage() {
  return (
    <div className="porto-bg min-h-screen relative overflow-x-hidden">

      {/* FX background — dark mode only */}
      <div className="porto-fx fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Source glow bar at top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, transparent 4%, rgba(168,85,247,0.55) 22%, rgba(192,132,252,0.65) 38%, rgba(217,70,239,0.6) 52%, rgba(192,132,252,0.65) 66%, rgba(168,85,247,0.55) 80%, transparent 96%)",
          boxShadow: "0 0 18px 5px rgba(168,85,247,0.4), 0 0 40px 10px rgba(168,85,247,0.18)",
          animation: "topGlow 3s ease-in-out infinite",
        }} />

        {/* Stage-light beams */}
        {BEAMS.map((b, i) => (
          <div key={i} style={{ position: "absolute", top: 0, left: b.left, transformOrigin: "top center", transform: `rotate(${b.rotateDeg}deg)` }}>
            <div style={{ position: "absolute", left: `calc(-20px + ${b.coreW / 2}px)`, top: 0, width: 44, height: b.height, background: `linear-gradient(to bottom, ${b.glowColor}, transparent 80%)`, filter: "blur(22px)", transformOrigin: "top center", animation: `beamPulse ${b.duration} ease-in-out infinite`, animationDelay: b.delay }} />
            <div style={{ width: b.coreW, height: b.height, background: `linear-gradient(to bottom, ${b.color}, transparent 85%)`, filter: "blur(5px)", transformOrigin: "top center", animation: `beamPulse ${b.duration} ease-in-out infinite`, animationDelay: b.delay }} />
          </div>
        ))}

        {/* Drifting blobs */}
        <div className="absolute rounded-full" style={{ top: "28%", left: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(168,85,247,0.16), transparent 65%)", filter: "blur(70px)", animation: "driftBlob 24s ease-in-out infinite" }} />
        <div className="absolute rounded-full" style={{ top: "58%", right: "-12%", width: 680, height: 680, background: "radial-gradient(circle, rgba(217,70,239,0.12), transparent 65%)", filter: "blur(80px)", animation: "driftBlob 30s ease-in-out infinite reverse" }} />

        {/* Moving light streams — opacity:0 initial prevents flash at top-left before animation kicks in */}
        <div style={{ position: "absolute", top: 0, left: 0, opacity: 0, width: 3, height: "72vh", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.92) 42%, rgba(216,180,254,0.7) 72%, transparent)", boxShadow: "0 0 26px 2px rgba(216,180,254,0.55)", mixBlendMode: "screen", animation: "streamA 15s linear infinite", animationFillMode: "both" }} />
        <div style={{ position: "absolute", top: 0, left: 0, opacity: 0, width: 2, height: "64vh", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.85) 45%, rgba(192,132,252,0.65) 75%, transparent)", boxShadow: "0 0 22px 2px rgba(192,132,252,0.5)", mixBlendMode: "screen", animation: "streamB 19s linear infinite", animationDelay: "3s", animationFillMode: "both" }} />
        <div style={{ position: "absolute", top: 0, left: 0, opacity: 0, width: 2.5, height: "68vh", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.8) 44%, rgba(217,70,239,0.6) 74%, transparent)", boxShadow: "0 0 24px 2px rgba(217,70,239,0.45)", mixBlendMode: "screen", animation: "streamC 17s linear infinite", animationDelay: "7s", animationFillMode: "both" }} />
        <div style={{ position: "absolute", top: 0, left: 0, opacity: 0, width: 2, height: "58vh", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.78) 46%, rgba(216,180,254,0.6) 76%, transparent)", boxShadow: "0 0 20px 2px rgba(216,180,254,0.45)", mixBlendMode: "screen", animation: "streamD 21s linear infinite", animationDelay: "11s", animationFillMode: "both" }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <PortfolioHeader />

        <main>
          <Hero />
          <PortfolioTabs
            projectsContent={<Projects />}
            experienceContent={<Experience />}
            educationContent={<Education />}
            certificationsContent={<Certifications />}
            cvContent={<CVSection />}
          />
        </main>

        <footer className="text-center px-6 pb-14 font-mono text-sm text-muted-foreground">
          <span className="text-primary">$</span>{" "}
          echo &quot;&copy; {new Date().getFullYear()} Rejan Toverlani &mdash; built with caffeine in Prishtina&quot;
        </footer>
      </div>
    </div>
  )
}
