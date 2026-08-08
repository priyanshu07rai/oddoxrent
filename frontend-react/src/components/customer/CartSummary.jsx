import React from 'react';
import Button from '../ui/Button';
import PriceDisplay from '../ui/PriceDisplay';
import Skeleton from '../ui/Skeleton';
import { Info } from 'lucide-react';

const CartSummary = ({ cart, loading, onCheckout }) => {
  if (loading) {
    return (
      <div className="bg-elevated border border-subtle rounded-2xl p-6">
        <Skeleton className="w-1/2 h-6 mb-6" />
        <div className="space-y-4 mb-6">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  const { items = [], rentalTotal = 0, depositTotal = 0, deliveryFee = 0, total = 0 } = cart || {};

  return (
    <div className="bg-elevated border border-subtle rounded-2xl p-6 sticky top-6">
      <h3 className="font-semibold text-lg text-text mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Rental Amount</span>
          <PriceDisplay amount={rentalTotal} className="text-text font-medium" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted flex items-center gap-1">
            Security Deposit 
            <span title="Refundable after return" className="cursor-help"><Info className="w-3 h-3 text-text-secondary" /></span>
          </span>
          <PriceDisplay amount={depositTotal} className="text-text font-medium" />
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="text-success font-medium">Free</span>
          ) : (
            <PriceDisplay amount={deliveryFee} className="text-text font-medium" />
          )}
        </div>
      </div>
      
      <div className="border-t border-subtle pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-text text-base">Total Payable</span>
          <PriceDisplay amount={total} className="font-bold text-xl text-text" />
        </div>
        <p className="text-xs text-muted">
          * Deposit is refundable subject to return conditions.
        </p>
      </div>
      
      <Button 
        variant="primary" 
        className="w-full" 
        onClick={onCheckout}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
