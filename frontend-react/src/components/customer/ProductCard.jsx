import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Sparkles, Package } from 'lucide-react';
import Badge from '../ui/Badge';
import PriceDisplay from '../ui/PriceDisplay';
import Button from '../ui/Button';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const {
    id, name, slug, short_description, images, primary_image,
    category, category_name, pricings, rating, review_count,
    is_featured, price
  } = product;

  // Resolve image URL
  let imageUrl = primary_image;
  if (!imageUrl && images && images.length > 0) {
    const first = images[0];
    imageUrl = typeof first === 'string' ? first : (first.url || first.image_url);
  }

  const cheapestPricing = pricings && pricings.length > 0 
    ? [...pricings].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0] 
    : null;

  const priceAmount = cheapestPricing ? cheapestPricing.price : (price || 0);
  const periodLabel = cheapestPricing ? (cheapestPricing.period_name || 'day') : 'day';
  const categoryLabel = category_name || (typeof category === 'string' ? category : category?.name);

  return (
    <motion.div 
      className="group relative flex flex-col bg-bg-elevated border border-border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-xl"
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/product/${slug}`)}
    >
      {is_featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="accent" className="shadow-md backdrop-blur-md bg-accent text-white border-none flex items-center gap-1 font-bold text-[11px] px-2.5 py-1">
            <Sparkles className="w-3 h-3" /> Featured
          </Badge>
        </div>
      )}

      {/* Stock availability indicator */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-success/10 text-success border border-success/20 backdrop-blur-md">
          <ShieldCheck className="w-3 h-3" /> In Stock
        </span>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-subtle">
        {imageUrl && !imgError ? (
          <motion.img 
            src={imageUrl} 
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 text-center">
            <Package className="w-10 h-10 text-accent/60 mb-2" />
            <span className="text-xs font-bold text-text-secondary line-clamp-1">{name}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-5">
        {categoryLabel && (
          <div className="mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
              {categoryLabel}
            </span>
          </div>
        )}

        <h3 className="font-extrabold text-text text-base line-clamp-1 mb-1.5 group-hover:text-accent transition-colors">
          {name}
        </h3>

        <p className="text-xs text-text-muted line-clamp-2 mb-4 flex-grow leading-relaxed">
          {short_description || 'High quality equipment available for flexible short and long term rentals.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-border-subtle">
          <div className="flex flex-col">
            {rating > 0 && (
              <div className="flex items-center text-xs text-warning mb-0.5">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                <span className="font-bold text-text">{rating}</span>
                <span className="text-text-muted ml-1">({review_count || 12})</span>
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <PriceDisplay amount={priceAmount} className="text-text font-black text-lg" />
              <span className="text-xs text-text-muted font-medium">/ {periodLabel.toLowerCase()}</span>
            </div>
          </div>

          <Button 
            variant="primary" 
            size="sm" 
            className="rounded-xl px-4 py-2 text-xs font-bold shadow-sm hover:shadow-md transition-all"
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate(`/product/${slug}`); 
            }}
          >
            Rent Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
