import { marked } from "marked"

export function parseMarkdown(content: string): string {
  const html = marked.parse(content) as string
  // Wrap fenced code blocks that have a language tag with a header showing the language
  return html.replace(
    /<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, code) =>
      `<div class="code-block"><div class="code-block-header"><span class="code-block-lang">${lang}</span></div><pre><code class="language-${lang}">${code}</code></pre></div>`
  )
}
