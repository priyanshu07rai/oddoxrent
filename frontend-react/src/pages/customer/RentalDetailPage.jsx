import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, MapPin, Store, Truck, Download, Info } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import RentalTimeline from '../../components/customer/RentalTimeline';
import DepositStatus from '../../components/customer/DepositStatus';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PriceDisplay from '../../components/ui/PriceDisplay';
import Skeleton from '../../components/ui/Skeleton';
import * as rentalsApi from '../../api/rentals';
import * as invoicesApi from '../../api/invoices';

const RentalDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => rentalsApi.getOrderById(orderId)
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="w-32 h-6 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="w-full h-32 rounded-2xl" />
              <Skeleton className="w-full h-96 rounded-2xl" />
            </div>
            <div>
              <Skeleton className="w-full h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const order = data?.data;
  if (!order) return null;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <button 
          onClick={() => navigate('/my-rentals')}
          className="flex items-center gap-1 text-sm text-muted hover:text-text transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back to My Rentals
        </button>

        {order.is_overdue && (
          <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Overdue Rental Notice</h4>
              <p className="text-sm mt-1">This rental is overdue by {order.overdue_days} days. Late fees of <PriceDisplay amount={order.late_fee || 0} /> have been applied to your deposit.</p>
            </div>
          </div>
        )}

        <div className="bg-elevated border border-subtle rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-subtle pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-muted uppercase tracking-wider">{order.order_number || orderId}</span>
                <Badge variant={order.status === 'active' ? 'success' : order.status === 'overdue' ? 'danger' : 'subtle'} className="capitalize">
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">{order.product?.name || 'Product Name'}</h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-muted">Rental Period</p>
              <p className="font-medium">{order.start_date} → {order.end_date}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <img src={order.product?.image} alt="" className="w-20 h-20 bg-subtle rounded-xl object-cover" />
            <div>
              <p className="text-sm text-muted line-clamp-2">{order.product?.short_description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            
            <div className="flex overflow-x-auto gap-6 border-b border-subtle mb-6 scrollbar-hide">
              {['details', 'financial', 'invoice'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'details' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-bg border border-subtle rounded-xl p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      {order.delivery_method === 'delivery' ? <Truck className="w-4 h-4 text-muted" /> : <Store className="w-4 h-4 text-muted" />}
                      Delivery Information
                    </h3>
                    {order.delivery_method === 'delivery' ? (
                      <div className="text-sm text-text-secondary space-y-1">
                        <p className="font-medium text-text">{order.address?.name}</p>
                        <p>{order.address?.phone}</p>
                        <p>{order.address?.line1}</p>
                        {order.address?.line2 && <p>{order.address?.line2}</p>}
                        <p>{order.address?.city} - {order.address?.zip}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-text-secondary space-y-1">
                        <p className="font-medium text-text">Store Pickup</p>
                        <p>Central Hub, Main Street, City</p>
                      </div>
                    )}
                  </div>
                  
                  {order.status === 'inspected' && (
                    <div className="bg-bg border border-subtle rounded-xl p-5">
                      <h3 className="font-semibold mb-2">Inspection Notes</h3>
                      <p className="text-sm text-text-secondary">Item received in good condition. Deposit refund has been initiated.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-bg border border-subtle rounded-xl p-5 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Rental Amount</span>
                      <PriceDisplay amount={order.rental_amount || 0} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Delivery Fee</span>
                      <PriceDisplay amount={order.delivery_fee || 0} />
                    </div>
                    <div className="flex justify-between font-medium pt-4 border-t border-subtle">
                      <span>Total Paid</span>
                      <PriceDisplay amount={order.total_price || 0} />
                    </div>
                    <div className="text-xs text-muted mt-2">Payment Ref: {order.payment_ref || 'TXN-123456'}</div>
                  </div>
                  
                  <DepositStatus deposit={order.deposit} lateFee={order.late_fee} />
                </div>
              )}

              {activeTab === 'invoice' && (
                <div className="bg-bg border border-subtle rounded-xl p-8 flex flex-col items-center justify-center animate-in fade-in min-h-[300px]">
                  <div className="w-16 h-16 bg-subtle rounded-full flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-muted" />
                  </div>
                  <h3 className="font-semibold mb-2">Invoice Available</h3>
                  <p className="text-sm text-muted text-center max-w-xs mb-6">Download a detailed tax invoice for this rental order.</p>
                  <Button onClick={() => invoicesApi.downloadInvoice(orderId)}>
                    Download PDF Invoice
                  </Button>
                </div>
              )}
            </div>

          </div>

          <div className="md:col-span-1">
            <RentalTimeline rental={order} />
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default RentalDetailPage;
