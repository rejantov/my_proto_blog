"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function ViewTracker() {
  const router = useRouter()

  useEffect(() => {
    fetch("/api/stats/view", { method: "POST" })
      .then(() => router.refresh())
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
