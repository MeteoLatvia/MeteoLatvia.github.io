// Use Vite to import all markdown files as raw text strings
const mdFiles = import.meta.glob('../../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  cover?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

// A lightweight frontmatter parser optimized for the browser
function parseFrontmatter(rawMd: string, slug: string): BlogPost {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(rawMd);
  
  let content = rawMd;
  const meta: Partial<BlogPostMeta> = { slug };
  
  if (match) {
    content = rawMd.replace(match[0], '').trim();
    const fmString = match[1];
    
    fmString.split('\n').forEach(line => {
      const splitIndex = line.indexOf(':');
      if (splitIndex > -1) {
        const key = line.slice(0, splitIndex).trim() as keyof BlogPostMeta;
        let val = line.slice(splitIndex + 1).trim();
        // Remove surrounding quotes if they exist
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        meta[key] = val as any;
      }
    });
  }
  
  return { ...meta, content } as BlogPost;
}

export function getAllPosts(): BlogPost[] {
  const posts = Object.entries(mdFiles).map(([path, raw]) => {
    // Extract filename without extension for the URL slug (e.g. "ziemas-vetra-2026")
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    return parseFrontmatter(raw as string, slug);
  });
  
  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}