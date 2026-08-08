import React from 'react';
import { Trash2, Package } from 'lucide-react';
import PriceDisplay from '../ui/PriceDisplay';

const CartItem = ({ item, onRemove }) => {
  if (!item) return null;

  const product = item.product || {};
  const productName = product.name || `Rental Product #${item.product_id || item.id}`;
  
  let imageUrl = product.primary_image;
  if (!imageUrl && product.images && product.images.length > 0) {
    const first = product.images[0];
    imageUrl = typeof first === 'string' ? first : (first.url || first.image_url);
  }

  const priceAmount = item.price || product.price || 0;
  const depositAmount = item.securityDeposit || product.pricings?.[0]?.security_deposit || 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border last:border-b-0">
      <div className="w-20 h-20 shrink-0 bg-bg-subtle rounded-2xl overflow-hidden border border-border">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted bg-accent-subtle">
            <Package className="w-6 h-6 text-accent" />
          </div>
        )}
      </div>
      
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-text text-base">{productName}</h4>
            {(item.start_date || item.startDate) && (
              <div className="text-xs text-text-muted mt-1 font-medium">
                Dates: {item.start_date || item.startDate} to {item.end_date || item.endDate}
              </div>
            )}
            {item.pricing && (
              <div className="text-xs text-text-secondary mt-0.5 font-semibold">
                Plan: <span className="capitalize text-accent">{item.pricing.period_name || item.pricing.period}</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => onRemove && onRemove(item.id)}
            className="text-text-muted hover:text-danger p-1.5 rounded-lg hover:bg-danger/10 transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-end justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Rental Fee</span>
            <PriceDisplay amount={priceAmount} className="font-extrabold text-text text-base" />
          </div>
          {depositAmount > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Deposit (Refundable)</span>
              <PriceDisplay amount={depositAmount} className="font-bold text-text-secondary text-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
