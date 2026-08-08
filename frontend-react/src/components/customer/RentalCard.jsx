import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import PriceDisplay from '../ui/PriceDisplay';
import Button from '../ui/Button';

const RentalCard = ({ rental }) => {
  const navigate = useNavigate();

  if (!rental) return null;

  const { id, order_number, product, status, start_date, end_date, total_price, is_overdue, overdue_days } = rental;

  const getStatusVariant = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'overdue': return 'danger';
      case 'completed': return 'default';
      case 'confirmed':
      case 'pickup_scheduled': return 'accent';
      default: return 'subtle';
    }
  };

  return (
    <div 
      className="relative flex flex-col bg-elevated border border-subtle rounded-2xl overflow-hidden hover:border-strong transition-colors cursor-pointer group"
      onClick={() => navigate(`/my-rentals/${id}`)}
    >
      {is_overdue && (
        <div className="bg-danger/10 text-danger text-xs font-medium px-4 py-2 text-center border-b border-danger/20">
          Overdue by {overdue_days} days
        </div>
      )}
      
      <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-subtle rounded-xl overflow-hidden">
          {product?.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted">No Img</div>
          )}
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">{order_number}</span>
            <Badge variant={getStatusVariant(status)} size="sm" className="capitalize">{status.replace('_', ' ')}</Badge>
          </div>
          <h4 className="font-semibold text-text text-base mb-1">{product?.name || 'Unknown Product'}</h4>
          <div className="text-sm text-text-secondary">
            {start_date} → {end_date}
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end justify-between self-stretch mt-4 sm:mt-0">
          <div className="flex flex-col sm:items-end mb-4 sm:mb-0">
            <span className="text-xs text-muted mb-1">Total Amount</span>
            <PriceDisplay amount={total_price} className="font-semibold text-text" />
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            className="w-full sm:w-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); navigate(`/my-rentals/${id}`); }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
