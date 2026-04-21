"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Terminal,
  Image as ImageIcon,
  FileVideo,
  FileText,
  X,
  Upload,
} from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  published: boolean
  author_id: string
  created_at: string
  updated_at: string
}

interface BlogEditorProps {
  userId: string
  existingPost?: BlogPost
}

interface UploadedMedia {
  url: string
  type: string
  filename: string
}

export function BlogEditor({ userId, existingPost }: BlogEditorProps) {
  const [title, setTitle] = useState(existingPost?.title || "")
  const [slug, setSlug] = useState(existingPost?.slug || "")
  const [content, setContent] = useState(existingPost?.content || "")
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || "")
  const [coverImage, setCoverImage] = useState(existingPost?.cover_image || "")
  const [published, setPublished] = useState(existingPost?.published || false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()
  
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!existingPost) {
      setSlug(generateSlug(value))
    }
  }
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    setError(null)
    
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)
      
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error("Upload failed")
        }
        
        const data = await response.json()
        
        const mediaType = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : "file"
        
        const newMedia: UploadedMedia = {
          url: data.url,
          type: mediaType,
          filename: file.name,
        }
        
        setUploadedMedia((prev) => [...prev, newMedia])
        
        // Auto-insert into content
        if (mediaType === "image") {
          setContent((prev) => prev + `\n\n![${file.name}](${data.url})`)
        } else {
          setContent((prev) => prev + `\n\n[Download ${file.name}](${data.url})`)
        }
      } catch (err) {
        setError(`Failed to upload ${file.name}`)
      }
    }
    
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      cover_image: coverImage || null,
      published,
      author_id: userId,
      updated_at: new Date().toISOString(),
    }
    
    try {
      if (existingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", existingPost.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert(postData)
        
        if (error) throw error
      }
      
      router.push("/admin")
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save post"
      setError(errorMessage)
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono transition-all ${
                published
                  ? "bg-green-500/20 text-green-500 border border-green-500/30"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {published ? "Published" : "Draft"}
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading || !title || !slug || !content}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-mono hover:neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive font-mono text-sm">
            Error: {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title..."
              className="w-full px-0 py-4 bg-transparent border-0 border-b border-border text-3xl font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          {/* Slug */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              slug: /blog/
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="post-url-slug"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          {/* Excerpt */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              excerpt (optional):
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post..."
              rows={2}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
          
          {/* Cover image URL */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              cover_image (optional):
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          {/* Media upload */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-sm text-muted-foreground">Media Attachments</h3>
              <label className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-mono cursor-pointer hover:bg-secondary/80 transition-all">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {uploadedMedia.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {uploadedMedia.map((media, index) => (
                  <div
                    key={index}
                    className="relative bg-secondary/50 rounded-lg p-3 flex flex-col items-center gap-2"
                  >
                    {media.type === "image" ? (
                      <ImageIcon className="h-6 w-6 text-primary" />
                    ) : media.type === "video" ? (
                      <FileVideo className="h-6 w-6 text-primary" />
                    ) : (
                      <FileText className="h-6 w-6 text-primary" />
                    )}
                    <span className="text-xs text-muted-foreground truncate w-full text-center">
                      {media.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedMedia((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                Upload images, videos, or PDFs to include in your post
              </p>
            )}
          </div>
          
          {/* Content */}
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              content:
            </label>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-b border-border">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">markdown supported</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here...

You can use markdown:
- **bold** and *italic*
- [links](url)
- ![images](url)
- Code blocks with ```

Uploaded media will be automatically inserted."
                rows={20}
                className="w-full px-4 py-4 bg-transparent text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none resize-none"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
