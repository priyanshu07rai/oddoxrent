import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import RentalCard from '../../components/customer/RentalCard';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import * as rentalsApi from '../../api/rentals';

const MyRentalsPage = () => {
  const [activeTab, setActiveTab] = useState('active');

  const { data, isLoading } = useQuery({
    queryKey: ['my-rentals'],
    queryFn: () => rentalsApi.getMyRentals()
  });

  const rentals = data?.data || [];

  const tabs = [
    { id: 'active', label: 'Active', filter: r => r.status === 'active' },
    { id: 'upcoming', label: 'Upcoming', filter: r => ['confirmed', 'pickup_scheduled', 'booked', 'delivery'].includes(r.status) },
    { id: 'past', label: 'Past', filter: r => ['completed', 'returned', 'inspected', 'settled'].includes(r.status) },
    { id: 'overdue', label: 'Overdue', filter: r => r.status === 'overdue' || r.is_overdue }
  ];

  const filteredRentals = rentals.filter(tabs.find(t => t.id === activeTab).filter);

  const getTabCounts = () => {
    const counts = {};
    tabs.forEach(tab => {
      counts[tab.id] = rentals.filter(tab.filter).length;
    });
    return counts;
  };
  
  const counts = getTabCounts();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4">
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
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
          icon={<Calendar className="w-12 h-12 text-muted" />}
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Rentals</h1>
        
        {/* Tab Bar */}
        <div className="flex overflow-x-auto gap-2 mb-8 border-b border-subtle pb-4 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id ? 'bg-text text-bg' : 'bg-elevated text-muted hover:text-text hover:bg-subtle border border-subtle'}
              `}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-bg text-text' : 'bg-subtle text-text'}`}>
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
