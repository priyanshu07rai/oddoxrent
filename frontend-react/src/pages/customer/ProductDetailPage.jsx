import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ChevronRight, Store, Truck, ShoppingCart, ShieldCheck, Clock, Shield } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import ProductGallery from '../../components/customer/ProductGallery';
import RentalDatePicker from '../../components/customer/RentalDatePicker';
import AvailabilityCalendar from '../../components/customer/AvailabilityCalendar';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { toast } from '../../components/ui/Toast';
import * as productsApi from '../../api/products';
import useCart from '../../hooks/useCart';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [activeTab, setActiveTab] = useState('description');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getProduct(slug)
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7"><Skeleton className="w-full aspect-[4/3] rounded-2xl" /></div>
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (isError || !data?.data) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-20">
          <EmptyState title="Product Not Found" description="The rental product you are looking for does not exist or has been unlisted." />
        </div>
      </PageTransition>
    );
  }

  const product = data.data;
  const categoryName = product.category_name || product.category?.name || product.category || 'Equipment';

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.primary_image ? [product.primary_image] : []);

  const handleAddToCart = () => {
    const sDate = startDate || todayStr;
    const eDate = endDate || defaultEndStr;
    
    addToCart({
      product,
      startDate: sDate,
      endDate: eDate,
      pricing: selectedPricing || { price: product.price, period_name: 'Daily' },
      deliveryMethod,
      quantity: 1
    });
    toast.success('Added to rental cart!');
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={galleryImages} productName={product.name} />
          </div>

          {/* Right: Info & Actions */}
          <div className="lg:col-span-5 flex flex-col">
            <nav className="flex items-center gap-2 text-xs font-medium text-text-muted mb-4">
              <Link to="/explore" className="hover:text-accent transition-colors">Rentals</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="capitalize text-accent font-semibold">{categoryName}</span>
            </nav>

            <div className="flex items-center justify-between gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text leading-tight">{product.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" /> In Stock
              </span>
            </div>
            
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4 text-xs font-medium">
                <div className="flex text-warning"><Star className="w-4 h-4 fill-current" /></div>
                <span className="font-bold text-text">{product.rating}</span>
                <span className="text-text-muted">({product.review_count || 12} reviews)</span>
              </div>
            )}

            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              {product.short_description || product.description}
            </p>
            
            <div className="w-full h-[1px] bg-border mb-6" />

            <div className="mb-6">
              <RentalDatePicker 
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                pricings={product.pricings || []}
                selectedPricing={selectedPricing}
                onPricingSelect={setSelectedPricing}
                basePrice={product.price}
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Delivery Option</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${deliveryMethod === 'delivery' ? 'border-accent bg-accent-subtle text-accent font-bold shadow-sm' : 'border-border bg-bg-elevated hover:border-border-strong text-text-muted hover:text-text'}`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-xs">Doorstep Delivery</span>
                </div>
                <div 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-accent bg-accent-subtle text-accent font-bold shadow-sm' : 'border-border bg-bg-elevated hover:border-border-strong text-text-muted hover:text-text'}`}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-xs">Store Pickup</span>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2 mb-4 font-bold rounded-2xl py-3.5 shadow-md text-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart & Reserve
            </Button>
            
            <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-accent" /> Escrow Protected Deposit</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> Instant Confirmation</span>
            </div>
          </div>
        </div>

        {/* Below fold: Tabs & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex overflow-x-auto gap-6 border-b border-border mb-8 scrollbar-hide">
              {['description', 'specifications', 'terms'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-text-secondary leading-relaxed">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p>{product.description || product.short_description}</p>
                  {product.included_items && (
                    <div className="mt-6 p-4 rounded-2xl bg-bg-elevated border border-border">
                      <h4 className="font-bold text-text mb-2">What's Included:</h4>
                      <p className="text-xs leading-relaxed">{product.included_items}</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications || {}).map(([k, v]) => (
                    <div key={k} className="py-2.5 px-3 rounded-xl bg-bg-elevated border border-border flex justify-between items-center text-xs">
                      <span className="text-text-muted font-medium capitalize">{k.replace('_', ' ')}</span>
                      <span className="font-bold text-text">{String(v)}</span>
                    </div>
                  ))}
                  {Object.keys(product.specifications || {}).length === 0 && <p className="text-xs text-text-muted">Standard manufacturer specifications apply.</p>}
                </div>
              )}
              {activeTab === 'terms' && (
                <div className="p-4 rounded-2xl bg-bg-elevated border border-border text-xs leading-relaxed">
                  <p>{product.rental_terms || 'Standard rental terms apply. Security deposit is fully refundable upon inspection.'}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <AvailabilityCalendar productId={product.id} unavailableDates={[]} />
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default ProductDetailPage;
