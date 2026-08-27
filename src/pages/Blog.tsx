import { useState } from 'react';
import { Link } from 'react-router';
import { getAllPosts } from '@/lib/blog';
import { format, parseISO } from 'date-fns';
import { lv } from 'date-fns/locale';

const CATEGORIES = ['Visi', 'Vētras', 'Prognozes', 'Izglītojoši', 'Foto'];

export function Blog() {
  const [activeCategory, setActiveCategory] = useState('Visi');
  const posts = getAllPosts();
  
  const filteredPosts = activeCategory === 'Visi' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">MeteoLatvia Blogs</h1>
          <p className="text-medium-emphasis">Raksti par atmosfēras fiziku, prognozēm un vētrām.</p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat 
                  ? 'bg-secondary text-white border-secondary' 
                  : 'bg-landmass text-medium-emphasis border-border hover:border-secondary/50 hover:text-high-emphasis'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <Link 
            key={post.slug} 
            to={`/blogs/${post.slug}`}
            className="group flex flex-col bg-landmass border border-border rounded-3xl overflow-hidden hover:border-secondary/50 transition-colors h-full"
          >
            {/* Cover Image */}
            <div className="h-48 w-full bg-ocean overflow-hidden relative">
              {post.cover ? (
                <img 
                  src={post.cover} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-low-emphasis font-black text-2xl opacity-10">METEO</div>
              )}
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-secondary border border-border/50">
                {post.category}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-xs text-medium-emphasis font-medium mb-3">
                {format(parseISO(post.date), 'd. MMMM, yyyy', { locale: lv })}
              </div>
              <h2 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-medium-emphasis text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="text-sm font-bold text-secondary flex items-center gap-1 mt-auto">
                Lasīt vairāk <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="col-span-full py-12 text-center text-medium-emphasis">
            Šajā kategorijā vēl nav rakstu.
          </div>
        )}
      </div>

    </div>
  );
}