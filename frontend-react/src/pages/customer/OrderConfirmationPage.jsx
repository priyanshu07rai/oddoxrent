import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Download, FileText, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/shared/PageTransition';
import Button from '../../components/ui/Button';
import PriceDisplay from '../../components/ui/PriceDisplay';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import VendorMap from '../../components/shared/VendorMap';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF';
import * as rentalsApi from '../../api/rentals';

const sampleProductMap = {
  1: { name: 'Sony FX3 Cinema Camera Kit', price: 2500, deposit: 10000 },
  2: { name: 'Apple MacBook Pro 16" M3 Max', price: 3000, deposit: 15000 },
  3: { name: 'Super73-RX Electric Adventure Bike', price: 1800, deposit: 5000 },
  4: { name: 'DJI Inspire 3 Cinema Drone 8K', price: 8000, deposit: 25000 },
  5: { name: 'Herman Miller Aeron Ergonomic Chair', price: 600, deposit: 3000 },
  6: { name: 'JBL PartyBox Ultimate PA System', price: 2000, deposit: 8000 },
  7: { name: 'EcoFlow Delta Pro Power Station', price: 1500, deposit: 6000 },
  8: { name: 'Apple Vision Pro 512GB VR Headset', price: 4000, deposit: 20000 }
};

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => rentalsApi.getOrder(orderId),
    enabled: !!orderId,
    retry: false
  });

  // Try reading order from local storage if placed during guest / demo checkout
  let localOrder = null;
  try {
    const stored = localStorage.getItem('rentos_placed_orders');
    if (stored) {
      const parsed = JSON.parse(stored);
      localOrder = parsed.find(o => o.id === orderId || o.order_number === orderId);
    }
  } catch (e) {
    console.warn('LocalStorage order read error', e);
  }

  const order = data?.data || localOrder || {
    id: orderId || 'RNT-892014',
    order_number: orderId || 'RNT-892014',
    status: 'active',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    rental_amount: 1800,
    deposit_amount: 5000,
    total_price: 6800,
    delivery_method: 'pickup',
    product: { name: 'Super73-RX Electric Adventure Bike' }
  };

  if (isLoading && !localOrder) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">
          <Skeleton className="w-20 h-20 rounded-full mb-6" />
          <Skeleton className="w-64 h-8 mb-4" />
          <Skeleton className="w-full h-64 rounded-3xl" />
        </div>
      </PageTransition>
    );
  }

  const productName = order.product?.name || order.items?.[0]?.product?.name || sampleProductMap[order.product_id]?.name || 'Super73-RX Electric Adventure Bike';
  const startDate = order.start_date || order.items?.[0]?.start_date || new Date().toISOString().split('T')[0];
  const endDate = order.end_date || order.items?.[0]?.end_date || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const rentalFee = order.rental_amount || (order.total_price ? Math.max(1000, order.total_price - (order.deposit_amount || 5000)) : 1800);
  const depositFee = order.deposit_amount || 5000;
  const totalCharged = order.total_price || (rentalFee + depositFee);

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        
        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-success/15 text-success flex items-center justify-center mb-6 shadow-md border border-success/30"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-black text-text mb-2 text-center">Rental Booking Confirmed!</h1>
        <p className="text-sm text-text-muted mb-8 max-w-md text-center">
          Your rental order has been reserved successfully for Store Pickup. Please bring a valid Govt ID to collect your gear at the Central Hub.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-bg-elevated border border-border rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
            <div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Booking Reference</span>
              <span className="font-mono font-extrabold text-accent text-base">{order.order_number || orderId}</span>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">
              Active / Reserved
            </span>
          </div>

          <div className="space-y-3.5 mb-8 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">Product Rented</span>
              <span className="font-extrabold text-text text-right">{productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">Rental Period</span>
              <span className="font-bold text-text text-right">{startDate} to {endDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">Fulfillment Choice</span>
              <span className="font-bold text-accent font-extrabold text-right">Store Pickup (Central Hub)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">Return Deadline</span>
              <span className="font-bold text-warning text-right">{endDate} 11:59 PM</span>
            </div>
          </div>

          <div className="bg-bg-subtle p-4 rounded-2xl space-y-3 mb-2 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted font-medium">Rental Charge</span>
              <PriceDisplay amount={rentalFee} className="font-bold text-text" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted font-medium">Escrow Deposit</span>
              <PriceDisplay amount={depositFee} className="font-bold text-text-secondary" />
            </div>
            <div className="flex justify-between font-extrabold text-base pt-3 border-t border-border">
              <span className="text-text">Total Charged</span>
              <PriceDisplay amount={totalCharged} className="text-accent font-black text-xl" />
            </div>
          </div>
        </div>

        {/* Interactive Vendor Store Map for Pickup */}
        <div className="w-full mb-8">
          <VendorMap 
            vendorLat={order.vendor_latitude || 28.6145}
            vendorLon={order.vendor_longitude || 77.2095}
            shopName={order.vendor_shop_name || 'RentOS Pro Vendor Hub'}
            areaName={order.vendor_area_name || 'Connaught Place Hub'}
            address={order.vendor_address || 'Block A, Inner Circle, Connaught Place, New Delhi 110001'}
            customerLat={28.6139}
            customerLon={77.2090}
            distanceKm={1.8}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button 
            variant="secondary" 
            className="rounded-xl font-bold flex items-center justify-center gap-2 py-3 border-accent/40 text-accent bg-accent-subtle/40 hover:bg-accent-subtle shadow-sm"
            onClick={() => generateInvoicePDF(order)}
          >
            <Download className="w-4 h-4" /> Download Tax Invoice
          </Button>
          <Button 
            onClick={() => navigate('/my-rentals')}
            className="rounded-xl font-bold flex items-center justify-center gap-2 shadow-md py-3"
          >
            <FileText className="w-4 h-4" /> View My Rentals
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-xl font-bold py-3"
            onClick={() => navigate('/explore')}
          >
            Browse More Gear
          </Button>
        </div>

      </div>
    </PageTransition>
  );
};

export default OrderConfirmationPage;
