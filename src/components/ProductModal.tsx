import React, { useState } from 'react';
import { X, Heart, Shield, Check, Scissors, Sparkles, Feather } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface ProductModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, monogram?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenBespoke: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenBespoke,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Default');
  const [monogramText, setMonogramText] = useState('');
  const [activeTab, setActiveTab] = useState<'provenance' | 'craft' | 'tailoring'>('provenance');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const convertedPrice = Math.round(product.price * currency.rate);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, monogramText.trim() ? monogramText.trim() : undefined);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-5xl bg-[#0d0b11] border border-white/15 shadow-2xl text-[#f4efe6] overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#09080b]/80 hover:bg-[#09080b] border border-white/10 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Left Column: Visual Gallery */}
        <div className="w-full md:w-1/2 bg-[#121017] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40 rounded-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            <div className="absolute bottom-3 left-3 bg-[#09080b]/80 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#c9a84c] border border-white/10">
              Serial Archive #{product.craftDetails.editionNumber}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 flex-shrink-0 overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#c9a84c] opacity-100 scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Spec Sheet & Acquisition */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/50 mb-1">
                <span>{product.capsuleName} Capsule</span>
                <span className="text-[#c9a84c]">{product.category}</span>
              </div>
              <h2 className="font-display-luxury text-2xl sm:text-3xl text-white font-medium">
                {product.name}
              </h2>
              <p className="text-white/60 text-sm font-light mt-1">
                {product.subtitle}
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display-luxury text-2xl font-bold text-[#c9a84c]">
                  {currency.symbol}{convertedPrice.toLocaleString()} {currency.code}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  Includes duty, VAT & white-glove transport
                </span>
              </div>
            </div>

            {/* Editorial Quote */}
            {product.editorialQuote && (
              <blockquote className="border-l-2 border-[#c9a84c]/60 pl-3 py-1 font-serif-luxury italic text-sm text-white/80">
                {product.editorialQuote}
              </blockquote>
            )}

            {/* General Overview */}
            <p className="text-sm text-white/70 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Technical Tabs (Provenance / Craftsmanship / Bespoke Fit) */}
            <div className="border border-white/10 rounded-sm bg-white/[0.02]">
              <div className="flex border-b border-white/10 text-xs uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('provenance')}
                  className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer ${
                    activeTab === 'provenance'
                      ? 'bg-white/10 text-[#c9a84c] font-semibold border-b-2 border-[#c9a84c]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Provenance
                </button>
                <button
                  onClick={() => setActiveTab('craft')}
                  className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer ${
                    activeTab === 'craft'
                      ? 'bg-white/10 text-[#c9a84c] font-semibold border-b-2 border-[#c9a84c]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Artisan Hand
                </button>
                <button
                  onClick={() => setActiveTab('tailoring')}
                  className={`flex-1 py-2.5 px-3 text-center transition-colors cursor-pointer ${
                    activeTab === 'tailoring'
                      ? 'bg-white/10 text-[#c9a84c] font-semibold border-b-2 border-[#c9a84c]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sizing Guide
                </button>
              </div>

              <div className="p-4 text-xs space-y-2.5 text-white/70">
                {activeTab === 'provenance' && (
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/[0.05] pb-1.5">
                      <span className="text-white/40">Composition:</span>
                      <span className="text-right text-white font-medium">{product.fabricDetails.composition}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.05] pb-1.5">
                      <span className="text-white/40">Fabric Weight:</span>
                      <span className="text-right text-white">{product.fabricDetails.weight}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.05] pb-1.5">
                      <span className="text-white/40">Weave / Milling:</span>
                      <span className="text-right text-white">{product.fabricDetails.weave}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Origin & Tailoring:</span>
                      <span className="text-right text-[#c9a84c]">{product.fabricDetails.origin}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'craft' && (
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/[0.05] pb-1.5">
                      <span className="text-white/40">Master Hand-Hours:</span>
                      <span className="text-right text-[#c9a84c] font-bold">{product.craftDetails.artisanHours} Hours of benchwork</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.05] pb-1.5">
                      <span className="text-white/40">Signature Method:</span>
                      <span className="text-right text-white max-w-[65%]">{product.craftDetails.technique}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Strict Edition Cap:</span>
                      <span className="text-right text-white">Strictly limited to {product.craftDetails.editionCount} pieces worldwide</span>
                    </div>
                  </div>
                )}

                {activeTab === 'tailoring' && (
                  <div className="space-y-2">
                    <p className="text-white/80">
                      Our silhouettes follow anatomical sculpting principles. If you fall between sizes or desire made-to-measure adjustment, select &quot;Bespoke Measure&quot;.
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-white/50">Need a Master Tailor consultation?</span>
                      <button
                        onClick={onOpenBespoke}
                        className="text-[#c9a84c] underline hover:text-white transition-colors cursor-pointer font-medium"
                      >
                        Book Virtual Fitting
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-2">
                <span className="text-white/60">Select Size / Cut</span>
                <span className="text-white/40 text-[10px]">International Standard</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-2 text-xs uppercase tracking-wider border rounded-sm transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c] font-semibold'
                        : 'border-white/10 hover:border-white/30 text-white/70'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Complimentary Bespoke Monogramming */}
            <div className="border border-white/10 p-3 rounded-sm bg-white/[0.02]">
              <div className="flex items-center justify-between text-xs tracking-wider mb-1.5">
                <div className="flex items-center gap-1.5 text-[#c9a84c]">
                  <Scissors size={13} />
                  <span className="uppercase font-medium">Complimentary Monogramming</span>
                </div>
                <span className="text-[10px] text-white/40 uppercase">Gold-Thread Lining</span>
              </div>
              <input
                type="text"
                maxLength={8}
                value={monogramText}
                onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                placeholder="Optional initials (e.g. D.L. or VII)"
                className="w-full bg-white/[0.04] border border-white/10 text-xs px-3 py-1.5 text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c] tracking-widest uppercase"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-4 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] font-semibold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(201,168,76,0.2)]"
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Acquire Edition ({currency.symbol}{convertedPrice.toLocaleString()})</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-4 border rounded-sm transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-[#c9a84c] bg-[#c9a84c]/20 text-[#c9a84c]'
                    : 'border-white/15 hover:border-white/30 text-white/70 hover:text-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Atelier Guarantee Badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider text-white/40 pt-1">
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-[#c9a84c]" />
                <span>Certificate of Authenticity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Feather size={12} className="text-[#c9a84c]" />
                <span>Lifetime Atelier Repairs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
