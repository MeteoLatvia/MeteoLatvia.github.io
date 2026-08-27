import { useParams, Link, Navigate } from 'react-router';
import { getPostBySlug } from '@/lib/blog';
import { format, parseISO } from 'date-fns';
import { lv } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || '');

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-12">
      <Link to="/blogs" className="inline-flex items-center gap-2 text-medium-emphasis hover:text-secondary font-medium text-sm mb-8 transition-colors">
        <ArrowLeft size={16} />
        Atpakaļ uz blogu
      </Link>

      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 text-sm font-medium mb-4">
          <span className="text-secondary">{post.category}</span>
          <span className="text-border">•</span>
          <span className="text-medium-emphasis">{format(parseISO(post.date), 'd. MMMM, yyyy', { locale: lv })}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>
      </header>

      {post.cover && (
        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 border border-border">
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Markdown Body styling applied directly since we don't have Tailwind Typography plugin */}
      <div className="prose-container text-lg text-high-emphasis leading-relaxed space-y-6">
        <ReactMarkdown
          components={{
            h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-12 mb-4 text-white" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} />,
            p: ({node, ...props}) => <p className="text-medium-emphasis mb-6" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 text-medium-emphasis mb-6" {...props} />,
            li: ({node, ...props}) => <li {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
            a: ({node, ...props}) => <a className="text-secondary hover:underline" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}