import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  currency: CurrencyConfig;
  onRemove: (id: string) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onRemove,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-[#0d0b11] border-l border-white/10 text-[#f4efe6] flex flex-col justify-between shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display-luxury text-xl text-white tracking-widest">
                  SAVED ARCHIVES
                </span>
                <span className="text-xs text-[#c9a84c] font-serif italic">({items.length})</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-0.5">
                Personal Curation Dossier
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full border border-white/10 transition-colors cursor-pointer"
              aria-label="Close Wishlist"
            >
              <X size={18} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <p className="font-display-luxury text-lg text-white/40">
                  No artifacts saved
                </p>
                <p className="text-xs text-white/40 max-w-xs font-light">
                  Click the heart icon on any numbered edition to curate your personal archive.
                </p>
              </div>
            ) : (
              items.map((prod) => {
                const converted = Math.round(prod.price * currency.rate);
                return (
                  <div
                    key={prod.id}
                    className="flex gap-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-sm relative"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-20 h-24 object-cover rounded-sm bg-black"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-semibold text-white tracking-wider line-clamp-1">
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => onRemove(prod.id)}
                            className="text-white/30 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            title="Remove from saved"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                          {prod.capsuleName} • Edition {prod.craftDetails.editionNumber}
                        </p>
                        <p className="text-xs font-semibold text-[#c9a84c] mt-1">
                          {currency.symbol}{converted.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onMoveToCart(prod);
                          onRemove(prod.id);
                        }}
                        className="w-full mt-2 py-2 bg-white/[0.06] hover:bg-[#c9a84c] hover:text-[#09080b] text-white border border-white/10 hover:border-transparent text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={12} />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-[#09080b]">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
