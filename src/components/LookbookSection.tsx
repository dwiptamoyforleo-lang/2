import React, { useState } from 'react';
import { Eye, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface LookbookSectionProps {
  products: Product[];
  onInspectProduct: (product: Product) => void;
}

const LOOKS = [
  {
    id: 'look-1',
    title: 'Look 01: The Solitary Pilgrim',
    sub: 'Nirvaan Capsule / Autumn-Winter',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    productId: 'sv-01',
    description: 'A towering silhouette cut in 720 GSM Melton wool. Blind-stitched edges creating an impenetrable monolith against winter gale.',
    tags: ['Biella Melton Wool', 'Habotai Silk Lining', 'Floating Canvas'],
  },
  {
    id: 'look-2',
    title: 'Look 02: Midnight Celestial',
    sub: 'Akash Capsule / Celestial Equinox',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    productId: 'sv-02',
    description: 'Deep midnight indigo Japanese jacquard tailored with razor high-armhole sleeves and peak lapels tipped in pure silver leaf foil.',
    tags: ['Super 160s Fine Wool', 'Kyoto Filament', 'Hand-Sewn Milanese'],
  },
  {
    id: 'look-3',
    title: 'Look 03: Terrestrial Solstice',
    sub: 'Prithvi Capsule / Terrestrial Solstice',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    productId: 'sv-03',
    description: 'Hand-spun Changthangi cashmere drape paired with natural golden wild Muga silk tunic. An homage to high-altitude Himalayan nomads.',
    tags: ['12-Micron Cashmere', 'Ahimsa Muga Silk', 'Hand-Spun Charkha'],
  },
  {
    id: 'look-4',
    title: 'Look 04: The Temporal Armor',
    sub: 'Kala Capsule / Permanent Archive',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    productId: 'sv-04',
    description: 'Full-grain French bullhide treated with beeswax paired with a 5-axis aerospace titanium neck torc chronograph.',
    tags: ['Vegetable Bullhide', 'Aerospace Titanium', 'Hand-Burnished'],
  },
];

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  products,
  onInspectProduct,
}) => {
  const [currentLookIndex, setCurrentLookIndex] = useState(0);
  const look = LOOKS[currentLookIndex];
  const matchedProduct = products.find((p) => p.id === look.productId);

  const handleNext = () => {
    setCurrentLookIndex((prev) => (prev + 1) % LOOKS.length);
  };

  const handlePrev = () => {
    setCurrentLookIndex((prev) => (prev - 1 + LOOKS.length) % LOOKS.length);
  };

  return (
    <section id="lookbook" className="py-24 sm:py-32 bg-[#0c0a10] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#c9a84c] mb-2">
              <Sparkles size={12} />
              <span>Editorial Vignettes</span>
            </div>
            <h2 className="font-display-luxury text-3xl sm:text-5xl text-white font-light tracking-wide">
              THE ATELIER LOOKBOOK
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-light mt-2 max-w-xl">
              Immerse yourself in our seasonal silhouettes captured in natural atmospheric lighting.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-white/40 mr-2">
              {currentLookIndex + 1} / {LOOKS.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-3 border border-white/15 hover:border-white/40 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Previous Look"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-3 border border-white/15 hover:border-white/40 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Next Look"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Lookbook Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#09080b] border border-white/[0.08] p-6 sm:p-10 rounded-sm">
          {/* Main Visual Look */}
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden rounded-sm bg-black">
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover object-top transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a84c]">
                  {look.sub}
                </span>
                <h3 className="font-display-luxury text-xl sm:text-2xl text-white mt-1">
                  {look.title}
                </h3>
              </div>

              {matchedProduct && (
                <button
                  onClick={() => onInspectProduct(matchedProduct)}
                  className="px-4 py-2.5 bg-[#c9a84c] text-[#09080b] text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 shadow-lg hover:bg-[#dfc067] transition-colors cursor-pointer"
                >
                  <Eye size={12} />
                  <span>Inspect Garment</span>
                </button>
              )}
            </div>
          </div>

          {/* Editorial Notes */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9a84c]">
                Curatorial Note
              </span>
              <h4 className="font-serif-luxury text-2xl sm:text-3xl italic text-white/90">
                Sculpting Solitude Through Drapery
              </h4>
            </div>

            <p className="text-sm text-white/60 font-light leading-relaxed">
              {look.description}
            </p>

            {/* Tags */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                Key Elements & Textiles:
              </span>
              <div className="flex flex-wrap gap-2">
                {look.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/[0.04] border border-white/10 text-white/70 text-xs rounded-sm tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnail Carousel selector */}
            <div className="pt-6 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-3">
                All Looks in this Series:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {LOOKS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentLookIndex(idx)}
                    className={`aspect-[3/4] overflow-hidden border transition-all cursor-pointer ${
                      currentLookIndex === idx
                        ? 'border-[#c9a84c] scale-105'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
