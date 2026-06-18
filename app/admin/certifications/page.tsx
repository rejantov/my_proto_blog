import { redirect } from "next/navigation"
import { isAdminEmail } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { CertificationsManager } from "@/components/admin/certifications-manager"

export default async function AdminCertificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  if (!isAdminEmail(user.email)) {
    redirect("/login?error=unauthorized")
  }

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("date_issued", { ascending: false })

  return <CertificationsManager initialCertifications={certifications ?? []} />
}
