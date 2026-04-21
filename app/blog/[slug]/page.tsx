import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, ArrowRight, Calendar, Sparkles, Star, Heart, Share2 } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  
  if (!post) {
    return { title: "Post Not Found" }
  }
  
  return {
    title: `${post.title} | Rejan's Digital Diary`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  
  if (!post) {
    notFound()
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  return (
    <div className="min-h-screen bg-[hsl(260,25%,6%)] overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Navigation bar */}
      <nav className="webring-nav flex items-center justify-center gap-4 text-sm">
        <Link href="/blog" className="flex items-center gap-1 text-white hover:text-yellow-300 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {"<< BACK TO BLOG"}
        </Link>
        <span className="text-fuchsia-300">|</span>
        <span className="text-fuchsia-200">READING POST</span>
        <span className="text-fuchsia-300">|</span>
        <Link href="/" className="flex items-center gap-1 text-white hover:text-yellow-300 transition-colors">
          {"PORTFOLIO >>"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
      
      <main className="relative z-10 px-4 py-8">
        <article className="max-w-4xl mx-auto">
          
          {/* Post header */}
          <header className="retro-box p-6 mb-6">
            {/* Decorative top */}
            <div className="flex items-center justify-center gap-2 text-fuchsia-400 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">{"~*~*~*~*~*~*~*~"}</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-4 neon-text-pink">
              {post.title}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-fuchsia-300">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400" />
              </span>
            </div>
            
            {/* Decorative bottom */}
            <div className="flex items-center justify-center gap-2 text-fuchsia-400 mt-4">
              <span className="text-sm">{"~*~*~*~*~*~*~*~"}</span>
            </div>
          </header>
          
          {/* Cover image */}
          {post.cover_image && (
            <div className="retro-box p-2 mb-6 text-center">
              <img
                src={post.cover_image}
                alt={post.title}
                className="max-w-full mx-auto border-4 border-double border-fuchsia-600"
              />
            </div>
          )}
          
          {/* Excerpt if exists */}
          {post.excerpt && (
            <div className="retro-box p-4 mb-6 border-l-4 border-l-fuchsia-500">
              <p className="text-lg text-fuchsia-200 italic">
                &quot;{post.excerpt}&quot;
              </p>
            </div>
          )}
          
          {/* Main content */}
          <div className="retro-box p-6 md:p-8">
            {/* Content rendered as paragraphs */}
            <div className="prose prose-invert max-w-none">
              {post.content.split("\n\n").map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-200 leading-relaxed mb-4 last:mb-0 text-lg">
                  {paragraph.split("\n").map((line: string, lineIndex: number) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < paragraph.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
          
          {/* Post footer */}
          <footer className="mt-6 space-y-4">
            {/* Share/react section */}
            <div className="retro-box p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-fuchsia-300">Did you like this post?</span>
                <button className="btn-neon text-sm px-3 py-1 flex items-center gap-1">
                  <Heart className="h-4 w-4" /> Like
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fuchsia-300">Share:</span>
                <button className="btn-neon text-sm px-3 py-1 flex items-center gap-1">
                  <Share2 className="h-4 w-4" /> Copy Link
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="retro-box p-4 flex items-center justify-between">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-fuchsia-400 hover:text-yellow-300 transition-colors font-bold"
              >
                <ArrowLeft className="h-5 w-5" />
                {"<< MORE POSTS"}
              </Link>
              
              <div className="text-fuchsia-300 text-sm">
                {"~ END OF POST ~"}
              </div>
              
              <span className="text-gray-500 text-sm">
                {">>"}
              </span>
            </div>
            
            {/* Decorative footer */}
            <div className="text-center py-4">
              <p className="text-fuchsia-400 text-sm mb-2">{"* * * * * * * * * *"}</p>
              <p className="text-gray-400 text-xs">Thanks for reading! {"<3"}</p>
              <p className="text-fuchsia-400 text-sm mt-2">{"* * * * * * * * * *"}</p>
            </div>
          </footer>
        </article>
      </main>
      
      {/* Bottom decoration */}
      <div className="text-center py-6 text-fuchsia-400">
        <div className="flex items-center justify-center gap-2 text-2xl">
          <span className="bounce-retro inline-block" style={{ animationDelay: "0s" }}>{"^"}</span>
          <span className="bounce-retro inline-block" style={{ animationDelay: "0.1s" }}>{"_"}</span>
          <span className="bounce-retro inline-block" style={{ animationDelay: "0.2s" }}>{"^"}</span>
        </div>
      </div>
    </div>
  )
}
