import React from 'react';
import { Heart, Eye, Plus, Sparkles } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}) => {
  const convertedPrice = Math.round(product.price * currency.rate);
  const convertedOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * currency.rate) : null;

  return (
    <div className="group relative flex flex-col bg-[#0e0c12] border border-white/[0.07] hover:border-[#c9a84c]/40 transition-all duration-500 overflow-hidden">
      {/* Image Container with Editorial Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#14121a]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Secondary hover image swap if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} detail`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
            loading="lazy"
          />
        )}

        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c12] via-transparent to-black/30 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="bg-[#09080b]/80 backdrop-blur-md px-2.5 py-1 border border-white/10 text-[9px] uppercase tracking-[0.25em] text-[#c9a84c] flex items-center gap-1.5">
            <Sparkles size={10} />
            <span>Edition {product.craftDetails.editionNumber}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-[#c9a84c] text-[#09080b]'
                : 'bg-[#09080b]/60 text-white/70 hover:text-white hover:bg-[#09080b]/90'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2.5 bg-[#09080b]/90 hover:bg-[#09080b] text-white border border-white/20 hover:border-white/40 text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
          >
            <Eye size={13} />
            <span>Inspect</span>
          </button>
          <button
            onClick={() => onQuickAdd(product)}
            className="py-2.5 px-3 bg-[#c9a84c] hover:bg-[#dfc067] text-[#09080b] text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center transition-colors cursor-pointer"
            title="Quick Add to Bag"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
            <span>{product.capsuleName} Capsule</span>
            <span className="text-[#c9a84c]/80">{product.category}</span>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-display-luxury text-base sm:text-lg text-[#f2eee9] group-hover:text-[#c9a84c] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-white/50 text-xs font-light line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Textile badge */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] tracking-wider text-white/40 truncate max-w-[60%]">
            {product.fabricDetails.weight}
          </span>
          <div className="text-right">
            <span className="text-sm font-semibold text-[#f4efe6] tracking-wider">
              {currency.symbol}{convertedPrice.toLocaleString()}
            </span>
            {convertedOriginalPrice && (
              <span className="ml-2 text-xs text-white/30 line-through">
                {currency.symbol}{convertedOriginalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
