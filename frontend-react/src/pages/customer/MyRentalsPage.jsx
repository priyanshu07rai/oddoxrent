import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import RentalCard from '../../components/customer/RentalCard';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
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

const MyRentalsPage = () => {
  const [activeTab, setActiveTab] = useState('active');

  const { data, isLoading } = useQuery({
    queryKey: ['my-rentals'],
    queryFn: () => rentalsApi.getMyRentals(),
    retry: false
  });

  // Read local orders placed in guest/demo session
  let localOrders = [];
  try {
    const stored = localStorage.getItem('rentos_placed_orders');
    if (stored) localOrders = JSON.parse(stored);
  } catch (e) {
    console.warn('LocalStorage read error', e);
  }

  const apiRentals = data?.data || [];
  
  // Combine API rentals and local orders
  const combined = [...localOrders, ...apiRentals];
  
  // Deduplicate by ID
  const uniqueMap = new Map();
  combined.forEach(item => {
    if (item && item.id && !uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });

  const rentals = Array.from(uniqueMap.values()).map(r => {
    // Format rental object so RentalCard renders cleanly
    const prod = r.product || r.items?.[0]?.product || sampleProductMap[3];
    return {
      ...r,
      order_number: r.order_number || r.id,
      status: r.status || 'active',
      start_date: r.start_date || new Date().toISOString().split('T')[0],
      end_date: r.end_date || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      total_price: r.total_price || r.total_amount || 6800,
      product: typeof prod === 'object' ? prod : { name: sampleProductMap[prod]?.name || 'Super73-RX Electric Adventure Bike' }
    };
  });

  const tabs = [
    { id: 'active', label: 'Active', filter: r => ['active', 'confirmed', 'pickup_scheduled'].includes(r.status) },
    { id: 'upcoming', label: 'Upcoming', filter: r => ['confirmed', 'pickup_scheduled', 'booked'].includes(r.status) },
    { id: 'past', label: 'Past', filter: r => ['completed', 'returned', 'inspected', 'settled'].includes(r.status) },
    { id: 'overdue', label: 'Overdue', filter: r => r.status === 'overdue' || r.is_overdue }
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
  const filteredRentals = rentals.filter(currentTabObj.filter);

  const getTabCounts = () => {
    const counts = {};
    tabs.forEach(tab => {
      counts[tab.id] = rentals.filter(tab.filter).length;
    });
    return counts;
  };
  
  const counts = getTabCounts();

  const renderContent = () => {
    if (isLoading && rentals.length === 0) {
      return (
        <div className="grid gap-4">
          <Skeleton className="w-full h-32 rounded-3xl" />
          <Skeleton className="w-full h-32 rounded-3xl" />
        </div>
      );
    }

    if (filteredRentals.length === 0) {
      if (activeTab === 'overdue') {
        return (
          <EmptyState 
            icon={<Check className="w-12 h-12 text-success" />}
            title="All good!"
            description="You have no overdue rentals. Keep it up!"
          />
        );
      }
      return (
        <EmptyState 
          icon={<Calendar className="w-12 h-12 text-text-muted" />}
          title={`No ${activeTab} rentals`}
          description="You don't have any rentals in this category."
        />
      );
    }

    return (
      <motion.div 
        className="grid gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
        }}
      >
        {filteredRentals.map(rental => (
          <motion.div key={rental.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <RentalCard rental={rental} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-text mb-8">My Rentals</h1>
        
        {/* Tab Bar */}
        <div className="flex overflow-x-auto gap-2 mb-8 border-b border-border pb-4 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'bg-bg-elevated text-text-muted hover:text-text hover:bg-bg-subtle border border-border'}
              `}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === tab.id ? 'bg-white text-accent' : 'bg-bg-subtle text-text'}`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default MyRentalsPage;
