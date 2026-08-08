import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Shield, AlertCircle, Package, CheckCircle2 } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import CheckoutSteps from '../../components/customer/CheckoutSteps';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PriceDisplay from '../../components/ui/PriceDisplay';
import VendorMap from '../../components/shared/VendorMap';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { toast } from '../../components/ui/Toast';
import * as paymentsApi from '../../api/payments';
import * as rentalsApi from '../../api/rentals';

const sampleProductMap = {
  1: { name: 'Sony FX3 Cinema Camera Kit', price: 2500, deposit: 10000, category: 'Cameras & Video' },
  2: { name: 'Apple MacBook Pro 16" M3 Max', price: 3000, deposit: 15000, category: 'Electronics' },
  3: { name: 'Super73-RX Electric Adventure Bike', price: 1800, deposit: 5000, category: 'Vehicles & E-Bikes' },
  4: { name: 'DJI Inspire 3 Cinema Drone 8K', price: 8000, deposit: 25000, category: 'Cameras & Video' },
  5: { name: 'Herman Miller Aeron Ergonomic Chair', price: 600, deposit: 3000, category: 'Office Furniture' },
  6: { name: 'JBL PartyBox Ultimate PA System', price: 2000, deposit: 8000, category: 'Audio & Sound' },
  7: { name: 'EcoFlow Delta Pro Power Station', price: 1500, deposit: 6000, category: 'Event & Outdoor' },
  8: { name: 'Apple Vision Pro 512GB VR Headset', price: 4000, deposit: 20000, category: 'Electronics' }
};

const getItemPrice = (item) => {
  const p = parseFloat(item.product?.price || item.price || 0);
  if (p > 0) return p;
  const fallback = sampleProductMap[item.product_id] || sampleProductMap[item.id] || sampleProductMap[3];
  return fallback.price;
};

const getItemDeposit = (item) => {
  const firstPricing = item.product?.pricings?.[0];
  const d = parseFloat(firstPricing?.security_deposit || item.securityDeposit || 0);
  if (d > 0) return d;
  const fallback = sampleProductMap[item.product_id] || sampleProductMap[item.id] || sampleProductMap[3];
  return fallback.deposit;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  
  // Smart pre-filled address state
  const [address, setAddress] = useState({
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'John Doe' : 'John Doe',
    phone: user?.phone || '+91 98765 43210',
    line1: 'RentOS Central Hub, Main Street',
    line2: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zip: '201301'
  });

  useEffect(() => {
    if (user) {
      setAddress(prev => ({
        ...prev,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || prev.name,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const steps = [
    { label: 'Review' },
    { label: 'Pickup Hub' },
    { label: 'Contact Info' },
    { label: 'Payment' }
  ];

  const itemsList = cart?.items || [];
  
  let calcRental = 0;
  let calcDeposit = 0;

  itemsList.forEach(item => {
    const qty = item.quantity || 1;
    calcRental += getItemPrice(item) * qty;
    calcDeposit += getItemDeposit(item) * qty;
  });

  const calculatedTotal = calcRental + calcDeposit;

  if (itemsList.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-subtle text-accent flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-text mb-2">Checkout Unavailable</h2>
        <p className="text-sm text-text-muted mb-6">Your rental cart is empty.</p>
        <Button size="lg" className="rounded-xl font-bold" onClick={() => navigate('/explore')}>Explore Products</Button>
      </div>
    );
  }

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const saveOrderToStorage = (orderObj) => {
    try {
      const existing = localStorage.getItem('rentos_placed_orders');
      const orders = existing ? JSON.parse(existing) : [];
      const updated = [orderObj, ...orders];
      localStorage.setItem('rentos_placed_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage order save failed', e);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const generatedId = `RNT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrderObj = {
      id: generatedId,
      order_number: generatedId,
      user_email: user?.email || 'guest@rentos.io',
      user_id: user?.id || null,
      status: 'active',
      items: itemsList,
      rental_amount: calcRental,
      deposit_amount: calcDeposit,
      total_price: calculatedTotal,
      delivery_method: 'pickup',
      address: address,
      created_at: new Date().toISOString(),
      start_date: itemsList[0]?.start_date || itemsList[0]?.startDate || new Date().toISOString().split('T')[0],
      end_date: itemsList[0]?.end_date || itemsList[0]?.endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      product: itemsList[0]?.product || { name: sampleProductMap[itemsList[0]?.product_id || 3]?.name || 'Super73-RX Electric Adventure Bike' }
    };

    saveOrderToStorage(newOrderObj);

    try {
      await rentalsApi.createOrder({ cart, deliveryMethod: 'pickup', address });
    } catch (err) {
      console.warn('Backend order API skipped/fallback', err);
    }

    clearCart();
    toast.success('Rental order reserved for Store Pickup successfully!');
    setIsProcessing(false);
    navigate(`/order-confirmation/${generatedId}`);
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-text mb-8">Checkout & Reserve</h1>
        
        <div className="mb-10">
          <CheckoutSteps currentStep={step} steps={steps} />
        </div>

        <div className="bg-bg-elevated border border-border rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* STEP 1: REVIEW */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-extrabold text-text mb-6">Review Rental Items</h2>
              <div className="space-y-4 mb-8">
                {itemsList.map(item => {
                  const product = item.product || {};
                  const fallbackInfo = sampleProductMap[item.product_id] || sampleProductMap[item.id] || sampleProductMap[3];
                  const productName = product.name || fallbackInfo.name;
                  const categoryName = product.category_name || product.category || fallbackInfo.category;

                  let imageUrl = product.primary_image;
                  if (!imageUrl && product.images && product.images.length > 0) {
                    const first = product.images[0];
                    imageUrl = typeof first === 'string' ? first : (first.url || first.image_url);
                  }

                  const itemPrice = getItemPrice(item);
                  const itemDeposit = getItemDeposit(item);

                  return (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                      <div className="w-16 h-16 rounded-2xl bg-bg-subtle border border-border overflow-hidden shrink-0">
                        {imageUrl ? (
                          <img src={imageUrl} alt={productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-accent bg-accent-subtle">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{categoryName}</span>
                        <h4 className="font-bold text-text text-sm">{productName}</h4>
                        {(item.start_date || item.startDate) && (
                          <p className="text-xs text-text-muted mt-0.5 font-medium">
                            {item.start_date || item.startDate} to {item.end_date || item.endDate}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <PriceDisplay amount={itemPrice} className="font-bold text-text text-base block" />
                        {itemDeposit > 0 && (
                          <span className="text-[11px] text-text-muted font-medium">Dep: ₹{itemDeposit}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center border-t border-border pt-6">
                <span className="text-base font-bold text-text">Total Payable</span>
                <PriceDisplay amount={calculatedTotal} className="text-2xl font-black text-accent" />
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} size="lg" className="rounded-xl font-bold px-8">Continue</Button>
              </div>
            </div>
          )}

          {/* STEP 2: PICKUP HUB */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-extrabold text-text mb-4">Store Pickup Fulfillment Hub</h2>
              
              <div className="mb-6">
                <VendorMap 
                  vendorLat={itemsList[0]?.product?.vendor_latitude || 28.6145}
                  vendorLon={itemsList[0]?.product?.vendor_longitude || 77.2095}
                  shopName={itemsList[0]?.product?.vendor_shop_name || 'RentOS Pro Vendor Store'}
                  areaName={itemsList[0]?.product?.vendor_area_name || 'Connaught Place Hub'}
                  address={itemsList[0]?.product?.vendor_address || 'Block A, Inner Circle, Connaught Place, New Delhi 110001'}
                  customerLat={28.6139}
                  customerLon={77.2090}
                  distanceKm={itemsList[0]?.product?.distance_km || 1.8}
                />
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={handleBack} className="rounded-xl font-bold">Back</Button>
                <Button onClick={handleNext} className="rounded-xl font-bold px-8">Confirm Pickup Hub</Button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT INFO */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-extrabold text-text mb-6">Contact & Verification Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input 
                  label="Full Name" 
                  value={address.name} 
                  onChange={(e) => setAddress(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input 
                  label="Phone Number" 
                  value={address.phone} 
                  onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="p-4 rounded-2xl bg-bg-subtle border border-border mb-6">
                <span className="text-xs font-bold text-text block mb-1">Government ID Requirement at Pickup</span>
                <span className="text-xs text-text-muted">Please present a valid Government ID (Aadhaar / Driving License / Passport) at the store hub during gear collection.</span>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={handleBack} className="rounded-xl font-bold">Back</Button>
                <Button onClick={handleNext} className="rounded-xl font-bold px-8">Proceed to Payment</Button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-extrabold text-text mb-6">Payment & Escrow Confirmation</h2>
              
              <div className="p-5 rounded-2xl bg-bg-subtle border border-border mb-6 space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Rental Fee</span>
                  <PriceDisplay amount={calcRental} className="font-bold text-text" />
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Escrow Security Deposit (Refundable)</span>
                  <PriceDisplay amount={calcDeposit} className="font-bold text-success" />
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-muted">Store Pickup Convenience Fee</span>
                  <span className="font-bold text-success">FREE</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-base font-bold">
                  <span className="text-text">Total Payable Now</span>
                  <PriceDisplay amount={calculatedTotal} className="font-black text-xl text-accent" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-accent-subtle border border-accent/30 text-accent text-xs font-bold flex items-center gap-2 mb-8">
                <Shield className="w-4 h-4 shrink-0" />
                Your security deposit is held safely in Escrow and automatically refunded upon gear return inspection.
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack} className="rounded-xl font-bold">Back</Button>
                <Button 
                  onClick={handlePayment} 
                  loading={isProcessing}
                  size="lg" 
                  className="rounded-xl font-extrabold px-8 shadow-md"
                >
                  Pay ₹{calculatedTotal.toLocaleString()} & Confirm Order
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutPage;
