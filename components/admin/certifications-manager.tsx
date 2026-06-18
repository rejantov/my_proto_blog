"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Award, Calendar, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CertificationItem {
  id: string
  name: string
  issuer: string
  date_issued: string
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
  description: string | null
  created_at: string
}

interface CertificationsManagerProps {
  initialCertifications: CertificationItem[]
}

const emptyForm = {
  name: "",
  issuer: "",
  dateIssued: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
  description: "",
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const [certifications, setCertifications] = useState(initialCertifications)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState(emptyForm.name)
  const [issuer, setIssuer] = useState(emptyForm.issuer)
  const [dateIssued, setDateIssued] = useState(emptyForm.dateIssued)
  const [expiryDate, setExpiryDate] = useState(emptyForm.expiryDate)
  const [credentialId, setCredentialId] = useState(emptyForm.credentialId)
  const [credentialUrl, setCredentialUrl] = useState(emptyForm.credentialUrl)
  const [description, setDescription] = useState(emptyForm.description)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setEditingId(null)
    setName(emptyForm.name)
    setIssuer(emptyForm.issuer)
    setDateIssued(emptyForm.dateIssued)
    setExpiryDate(emptyForm.expiryDate)
    setCredentialId(emptyForm.credentialId)
    setCredentialUrl(emptyForm.credentialUrl)
    setDescription(emptyForm.description)
  }

  const handleEdit = (item: CertificationItem) => {
    setEditingId(item.id)
    setName(item.name)
    setIssuer(item.issuer)
    setDateIssued(item.date_issued)
    setExpiryDate(item.expiry_date ?? "")
    setCredentialId(item.credential_id ?? "")
    setCredentialUrl(item.credential_url ?? "")
    setDescription(item.description ?? "")
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const certData = {
      name,
      issuer,
      date_issued: dateIssued,
      expiry_date: expiryDate || null,
      credential_id: credentialId || null,
      credential_url: credentialUrl || null,
      description: description || null,
    }

    try {
      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("certifications")
          .update(certData)
          .eq("id", editingId)
          .select("*")
          .single()

        if (updateError) throw updateError

        setCertifications((current) =>
          current
            .map((item) => (item.id === editingId ? data : item))
            .sort((a, b) => b.date_issued.localeCompare(a.date_issued)),
        )
      } else {
        const { data, error: insertError } = await supabase
          .from("certifications")
          .insert(certData)
          .select("*")
          .single()

        if (insertError) throw insertError

        setCertifications((current) =>
          [data, ...current].sort((a, b) => b.date_issued.localeCompare(a.date_issued)),
        )
      }

      resetForm()
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save certification")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item: CertificationItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return

    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from("certifications")
        .delete()
        .eq("id", item.id)

      if (deleteError) throw deleteError

      setCertifications((current) => current.filter((c) => c.id !== item.id))
      if (editingId === item.id) resetForm()
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete certification")
    } finally {
      setLoading(false)
    }
  }

  const formatMonth = (value: string | null) => {
    if (!value) return "No expiry"
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back</span>
          </Link>

          <button
            type="submit"
            form="cert-form"
            disabled={loading || !name || !issuer || !dateIssued}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-mono hover:neon-glow transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save Certification" : "Add Certification"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">Certifications</h1>
            <p className="text-sm text-muted-foreground font-mono">
              Manage certifications displayed on your portfolio.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive font-mono text-sm">
              Error: {error}
            </div>
          )}

          <div className="space-y-4">
            {certifications.length > 0 ? (
              certifications.map((item) => (
                <article key={item.id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                      </div>
                      <p className="text-sm text-primary font-mono mb-2">{item.issuer}</p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-1">
                        <Calendar className="h-4 w-4" />
                        Issued: {formatMonth(item.date_issued)}
                        {item.expiry_date && <> · Expires: {formatMonth(item.expiry_date)}</>}
                      </p>
                      {item.credential_id && (
                        <p className="text-xs text-muted-foreground font-mono">ID: {item.credential_id}</p>
                      )}
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground font-mono text-sm">
                No certifications yet.
              </div>
            )}
          </div>
        </section>

        <section>
          <form id="cert-form" onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-5 sticky top-24">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{editingId ? "Edit Certification" : "New Certification"}</h2>
                <p className="text-sm text-muted-foreground font-mono">Courses, certificates, and credentials.</p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-mono hover:bg-secondary/80 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="AWS Certified Developer"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">issuer</label>
              <input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Amazon Web Services"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">date_issued</label>
                <input
                  type="date"
                  value={dateIssued}
                  onChange={(e) => setDateIssued(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">expiry_date <span className="text-muted-foreground/50">(optional)</span></label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">credential_id <span className="text-muted-foreground/50">(optional)</span></label>
              <input
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="ABC-123-XYZ"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">credential_url <span className="text-muted-foreground/50">(optional)</span></label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">description <span className="text-muted-foreground/50">(optional, markdown)</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
              />
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
