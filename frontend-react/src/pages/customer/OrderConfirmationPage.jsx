import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Download, FileText } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import Button from '../../components/ui/Button';
import PriceDisplay from '../../components/ui/PriceDisplay';
import Skeleton from '../../components/ui/Skeleton';
import * as rentalsApi from '../../api/rentals';
import * as invoicesApi from '../../api/invoices';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => rentalsApi.getOrderById(orderId)
  });

  // Auto-redirect if needed, but the prompt says auto-redirect after 2s in checkout. Here we just display it.
  
  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full mb-8" />
          <Skeleton className="w-64 h-8 mb-4" />
          <Skeleton className="w-96 h-4 mb-12" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
      </PageTransition>
    );
  }

  if (isError || !data?.data) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4 text-danger">Order Not Found</h2>
          <Button onClick={() => navigate('/explore')}>Return to Explore</Button>
        </div>
      </PageTransition>
    );
  }

  const order = data.data;

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">
        
        <motion.div 
          className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Check className="w-12 h-12" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted text-center max-w-md mb-12">
          Your rental has been confirmed. We'll be in touch shortly. A confirmation email has been sent to you.
        </p>

        <div className="w-full bg-elevated border border-subtle rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-subtle pb-4">
            <span className="font-semibold">Booking ID</span>
            <span className="font-mono text-accent">{order.order_number || orderId}</span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-muted">Product(s)</span>
              <span className="font-medium text-right">{order.product?.name || 'Multiple items'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Rental Period</span>
              <span className="font-medium text-right">{order.start_date} to {order.end_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Method</span>
              <span className="font-medium capitalize text-right">{order.delivery_method || 'Delivery'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Return Deadline</span>
              <span className="font-medium text-warning text-right">{order.end_date} 11:59 PM</span>
            </div>
          </div>

          <div className="bg-bg p-4 rounded-xl space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Rental Paid</span>
              <PriceDisplay amount={order.rental_amount || 0} className="font-medium" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Deposit Held</span>
              <PriceDisplay amount={order.deposit_amount || 0} className="font-medium" />
            </div>
            <div className="flex justify-between font-semibold pt-3 border-t border-subtle">
              <span>Total Charged</span>
              <PriceDisplay amount={order.total_price || 0} />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            variant="secondary" 
            className="flex items-center justify-center gap-2"
            onClick={() => invoicesApi.downloadInvoice(orderId)}
          >
            <Download className="w-4 h-4" /> Download Invoice
          </Button>
          <Button 
            onClick={() => navigate(`/my-rentals/${orderId}`)}
            className="flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> View Rental Details
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')}
          >
            Continue Browsing
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderConfirmationPage;
