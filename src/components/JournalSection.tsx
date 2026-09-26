import React, { useState } from 'react';
import { BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import { ARTISAN_STORIES } from '../data/products';

export const JournalSection: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<(typeof ARTISAN_STORIES)[0] | null>(null);

  return (
    <section id="journal" className="py-24 sm:py-32 bg-[#09080b] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
            <Sparkles size={12} />
            <span>Atelier Chronicles</span>
          </div>
          <h2 className="font-display-luxury text-3xl sm:text-5xl text-white font-light tracking-wide">
            CRAFT JOURNAL & FIELD ESSAYS
          </h2>
          <p className="text-white/50 text-sm font-light leading-relaxed">
            Dispatches from remote weaving valleys, heritage tanneries, and precision lapidary studios.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTISAN_STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="group bg-[#0e0c12] border border-white/[0.07] hover:border-[#c9a84c]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden bg-black/50">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
                    <span>{story.location}</span>
                    <span className="text-[#c9a84c]">{story.readTime}</span>
                  </div>

                  <h3 className="font-display-luxury text-lg text-white group-hover:text-[#c9a84c] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="font-serif-luxury italic text-xs text-white/60 line-clamp-2">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs uppercase tracking-widest text-[#c9a84c]">
                  <span>Read Field Dispatch</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Reader Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="relative w-full max-w-2xl bg-[#0e0c12] border border-white/15 text-[#f4efe6] shadow-2xl p-6 sm:p-10 overflow-y-auto max-h-[85vh] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 p-2 bg-[#09080b]/80 hover:bg-[#09080b] border border-white/10 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a84c]">
                Field Essay • {selectedStory.location}
              </span>
              <h2 className="font-display-luxury text-2xl sm:text-3xl text-white">
                {selectedStory.title}
              </h2>
              <p className="text-xs text-white/40 uppercase tracking-widest">
                By {selectedStory.artisan} • {selectedStory.readTime}
              </p>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm">
              <img src={selectedStory.image} alt="" className="w-full h-full object-cover" />
            </div>

            <blockquote className="border-l-2 border-[#c9a84c] pl-4 py-2 font-serif-luxury italic text-lg text-[#f4efe6]">
              &ldquo;{selectedStory.quote}&rdquo;
            </blockquote>

            <div className="text-sm text-white/70 leading-relaxed font-light space-y-4">
              <p>
                Our expedition into the source of this sovereign material revealed generations of unbroken master stewardship. We do not negotiate speed with nature; rather, we adapt our tailoring schedules to seasonal harvesting cycles.
              </p>
              <p>
                Every thread that enters our cutting rooms carries biometric traceability, verifying zero synthetic additives and fair living compensation that sustains regional artisan communities for decades to come.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-6 py-2.5 bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                Close Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
