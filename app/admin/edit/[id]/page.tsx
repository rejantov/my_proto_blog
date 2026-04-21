import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogEditor } from "@/components/admin/blog-editor"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()
  
  if (!post) {
    notFound()
  }
  
  return <BlogEditor userId={user.id} existingPost={post} />
}
