import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, SlidersHorizontal, MapPin, Navigation, Compass } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import SearchBar from '../../components/customer/SearchBar';
import ProductGrid from '../../components/customer/ProductGrid';
import Button from '../../components/ui/Button';
import * as productsApi from '../../api/products';
import { getCurrentCustomerLocation, filterProductsWithinRadius, DEFAULT_CUSTOMER_LOCATION } from '../../utils/geoUtils';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [customerLocation, setCustomerLocation] = useState(DEFAULT_CUSTOMER_LOCATION);
  const [maxDistanceKm, setMaxDistanceKm] = useState(5.0); // 5km strict distance limit
  
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  
  // Auto-capture customer location on mount
  useEffect(() => {
    getCurrentCustomerLocation().then(loc => {
      setCustomerLocation(loc);
    });
  }, []);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { category: categoryParam, search: searchParam, sort: sortParam }],
    queryFn: () => productsApi.getProducts({ category: categoryParam, search: searchParam, sort: sortParam })
  });

  const categories = [
    'All Categories',
    'Cameras & Video',
    'Electronics',
    'Vehicles & E-Bikes',
    'Audio & Sound',
    'Office Furniture',
    'Event & Outdoor'
  ];

  const sampleProductsFallback = [
    { id: 1, name: 'Sony FX3 Cinema Camera Kit', slug: 'sony-fx3-camera', price: 2500, category_name: 'Cameras & Video', is_featured: true, primary_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', description: 'Cinema Line Full-frame Camera.' },
    { id: 2, name: 'Apple MacBook Pro 16" M3 Max', slug: 'macbook-pro-m3-max', price: 3000, category_name: 'Electronics', is_featured: true, primary_image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', description: 'Ultimate workstation for video editing.' },
    { id: 3, name: 'Super73-RX Electric Bike', slug: 'super73-rx-bike', price: 1800, category_name: 'Vehicles & E-Bikes', is_featured: false, primary_image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80', description: 'Powerful urban e-bike.' },
    { id: 4, name: 'DJI Inspire 3 Drone 8K', slug: 'dji-inspire-3-drone', price: 8000, category_name: 'Cameras & Video', is_featured: true, primary_image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80', description: 'Full-frame 8K Cinema Drone.' },
    { id: 5, name: 'Herman Miller Aeron Chair', slug: 'herman-miller-aeron', price: 600, category_name: 'Office Furniture', is_featured: false, primary_image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=600&q=80', description: 'Ergonomic office chair.' },
    { id: 6, name: 'JBL PartyBox Ultimate PA System', slug: 'jbl-partybox-ultimate', price: 2000, category_name: 'Audio & Sound', is_featured: false, primary_image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80', description: 'Massive Wi-Fi and Bluetooth speaker.' },
    { id: 7, name: 'EcoFlow Delta Pro Power Station', slug: 'ecoflow-delta-pro', price: 1500, category_name: 'Event & Outdoor', is_featured: false, primary_image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80', description: 'Portable power station.' },
    { id: 8, name: 'Apple Vision Pro VR Headset', slug: 'apple-vision-pro', price: 4000, category_name: 'Electronics', is_featured: true, primary_image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80', description: 'Spatial computing VR headset.' }
  ];

  const rawProducts = Array.isArray(productsData?.data?.results) 
    ? productsData.data.results 
    : (Array.isArray(productsData?.data) ? productsData.data : sampleProductsFallback);

  // Apply distance filtering: ONLY products <= maxDistanceKm (default 5.0 km)
  const filteredByDistance = filterProductsWithinRadius(
    rawProducts,
    customerLocation.latitude,
    customerLocation.longitude,
    maxDistanceKm
  );

  // Apply category & search filters
  const finalProducts = filteredByDistance.filter(p => {
    if (categoryParam && categoryParam.toLowerCase() !== 'all categories') {
      const pCat = (p.category_name || p.category?.name || p.category || '').toLowerCase();
      if (!pCat.includes(categoryParam.toLowerCase())) return false;
    }
    if (searchParam) {
      const q = searchParam.toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();
      if (!pName.includes(q) && !pDesc.includes(q)) return false;
    }
    return true;
  });

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All Categories') newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setMaxDistanceKm(5.0);
  };

  const hasFilters = categoryParam || searchParam || maxDistanceKm !== 5.0;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Hyper-Local Rental Marketplace</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-accent/10 text-accent px-2.5 py-0.5 rounded-full border border-accent/20">
                <Navigation className="w-3 h-3" /> Auto-Captured Geolocation
              </span>
            </div>
            <h1 className="text-3xl font-black text-text">Explore Nearby Rentals</h1>
            <p className="text-sm text-text-muted mt-1">
              {isLoading ? 'Scanning nearby vendor hubs...' : `Showing ${finalProducts.length} verified products within ${maxDistanceKm} km of your location`}
            </p>
          </div>
          
          <div className="md:hidden">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* 5 KM GEOLOCATION BANNER */}
        <div className="mb-8 p-4 rounded-3xl bg-bg-elevated border-2 border-border-strong flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-text text-sm">{customerLocation.area_name}</h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-success/15 text-success border border-success/30">
                  Lat: {customerLocation.latitude.toFixed(4)}, Lon: {customerLocation.longitude.toFixed(4)}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Strict <strong>5 km radius filter active</strong> for easy vendor shop pickup & return.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-text-muted whitespace-nowrap">Distance Radius:</span>
            <div className="flex bg-bg-subtle p-1 rounded-xl border border-border">
              {[5.0, 10.0, 20.0].map(dist => (
                <button
                  key={dist}
                  onClick={() => setMaxDistanceKm(dist)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    maxDistanceKm === dist 
                      ? 'bg-accent text-white shadow-xs' 
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {dist} km
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`
            md:w-64 shrink-0 space-y-6 bg-bg-elevated p-5 rounded-2xl border border-border h-fit shadow-sm
            ${showMobileFilters ? 'block' : 'hidden md:block'}
          `}>
            <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-text uppercase tracking-wider">Filter Equipment</h3>
            </div>

            <div>
              <label className="font-semibold text-xs text-text-muted uppercase tracking-wider block mb-2">Search Query</label>
              <SearchBar 
                initialValue={searchParam}
                onSearch={(val) => updateFilter('search', val)}
                placeholder="Search MacBook, Camera..."
              />
            </div>
            
            <div>
              <label className="font-semibold text-xs text-text-muted uppercase tracking-wider block mb-3">Categories</label>
              <div className="space-y-2">
                {categories.map(cat => {
                  const isSelected = (!categoryParam && cat === 'All Categories') || (categoryParam.toLowerCase() === cat.toLowerCase());
                  return (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group py-1">
                      <input 
                        type="radio" 
                        name="category"
                        checked={isSelected}
                        onChange={() => updateFilter('category', cat === 'All Categories' ? '' : cat)}
                        className="w-4 h-4 text-accent border-border focus:ring-accent accent-accent"
                      />
                      <span className={`text-xs font-medium transition-colors ${isSelected ? 'font-bold text-accent' : 'text-text-secondary group-hover:text-text'}`}>
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {hasFilters && (
              <div className="pt-3 border-t border-border-subtle">
                <Button variant="ghost" className="w-full text-xs font-bold text-accent" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Product Grid Container */}
          <div className="flex-1">
            <ProductGrid products={finalProducts} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default ExplorePage;
