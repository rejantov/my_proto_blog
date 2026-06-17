"use client"

import { useState } from "react"

interface PortfolioTabsProps {
  projectsContent: React.ReactNode
  experienceContent: React.ReactNode
  educationContent: React.ReactNode
  cvContent: React.ReactNode
}

const tabs = [
  { id: "projects",   label: "</> Projects"  },
  { id: "experience", label: "♥ Experience"  },
  { id: "education",  label: "✦ Education"   },
  { id: "cv",         label: "◈ CV/Resume"   },
]

const terminalLabels: Record<string, string> = {
  projects:   "$ ls ./projects",
  experience: "$ cat ./experience",
  education:  "$ cat ./education",
  cv:         "$ open ./resume.pdf",
}

export function PortfolioTabs({ projectsContent, experienceContent, educationContent, cvContent }: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState("projects")

  const activeStyle: React.CSSProperties = {
    padding: "13px 22px",
    borderRadius: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s",
    border: "1px solid rgba(192,132,252,0.6)",
    background: "rgba(168,85,247,0.16)",
    color: "#f0e6ff",
    boxShadow: "0 0 26px rgba(168,85,247,0.4)",
  }

  const inactiveStyle: React.CSSProperties = {
    padding: "13px 22px",
    borderRadius: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s",
    border: "1px solid rgba(192,132,252,0.16)",
    background: "rgba(168,85,247,0.04)",
    color: "#c3b6d8",
  }

  return (
    <section className="pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Tab nav */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? activeStyle : inactiveStyle}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = "rgba(192,132,252,0.4)"
                  e.currentTarget.style.color = "#f0e6ff"
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = "rgba(192,132,252,0.16)"
                  e.currentTarget.style.color = "#c3b6d8"
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Terminal label */}
        <p className="font-mono text-sm text-primary/70 mb-0 max-w-6xl mb-10">
          {terminalLabels[activeTab]}
        </p>

        {/* Tab content */}
        <div className="min-h-[400px] animate-fade-up">
          {activeTab === "projects"   && projectsContent}
          {activeTab === "experience" && experienceContent}
          {activeTab === "education"  && educationContent}
          {activeTab === "cv"         && cvContent}
        </div>
      </div>
    </section>
  )
}
