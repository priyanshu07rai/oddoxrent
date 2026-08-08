/**
 * Geolocation & Distance Utility for RentOS Equipment Platform
 * Implements Haversine Formula for 5km radius filtering and location auto-capture.
 */

// Default Central Hub Coordinates (Delhi CP Hub) if browser geolocation is unavailable
export const DEFAULT_CUSTOMER_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090,
  area_name: 'Central Hub, Connaught Place'
};

// Vendor Sample Hub Coordinates Map
export const VENDOR_HUB_MAP = {
  1: { latitude: 28.6145, longitude: 77.2095, area_name: 'Connaught Place Hub', shop_name: 'Sony Pro Cine Hub', address: 'Block A, Inner Circle, Connaught Place, New Delhi 110001' },
  2: { latitude: 28.6210, longitude: 77.2180, area_name: 'Barakhamba Hub', shop_name: 'iTech Laptop Rentals', address: 'Statesman House, Barakhamba Road, New Delhi 110001' },
  3: { latitude: 28.6280, longitude: 77.2060, area_name: 'Paharganj Hub', shop_name: 'E-Mobility Adventure Hub', address: 'Main Bazaar Road, Near Railway Station, New Delhi 110055' },
  4: { latitude: 28.6320, longitude: 77.2210, area_name: 'Mandi House Hub', shop_name: 'DJI Aerial Solutions', address: 'Copernicus Marg, Mandi House, New Delhi 110001' },
  5: { latitude: 28.6050, longitude: 77.1950, area_name: 'Karol Bagh Hub', shop_name: 'Ergo Workspace Furniture', address: 'Ajmal Khan Road, Karol Bagh, New Delhi 110005' },
  6: { latitude: 28.6400, longitude: 77.2300, area_name: 'Civil Lines Hub', shop_name: 'JBL Pro Audio Rental', address: 'Sham Nath Marg, Civil Lines, New Delhi 110054' },
  7: { latitude: 28.6450, longitude: 77.2350, area_name: 'Kashmere Gate Hub', shop_name: 'EcoFlow Power Hub', address: 'Lothian Road, Kashmere Gate, New Delhi 110006' },
  8: { latitude: 28.6900, longitude: 77.3000, area_name: 'Anand Vihar Hub', shop_name: 'Vision VR Experience Hub', address: 'Vikas Marg East, Anand Vihar, New Delhi 110092' }
};

/**
 * Calculates distance in kilometers between two lat/lon coordinates using Haversine Formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 1.8 km)
}

/**
 * Auto-captures customer current location from browser
 */
export function getCurrentCustomerLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation API not supported by browser. Using default Central Hub.');
      resolve(DEFAULT_CUSTOMER_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
          area_name: 'Your Current Location'
        });
      },
      (error) => {
        console.warn('Geolocation permission pending/denied. Using default Central Hub:', error.message);
        resolve(DEFAULT_CUSTOMER_LOCATION);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  });
}

/**
 * Attaches vendor location metadata to product object
 */
export function enrichProductLocation(product, customerLat, customerLon) {
  if (!product) return product;

  // Use stored vendor location or lookup fallback from VENDOR_HUB_MAP
  const hubData = VENDOR_HUB_MAP[product.id] || VENDOR_HUB_MAP[(product.id % 8) || 1];
  
  const vendorLat = product.latitude || product.vendor_latitude || hubData.latitude;
  const vendorLon = product.longitude || product.vendor_longitude || hubData.longitude;
  const areaName = product.area_name || product.vendor_area_name || hubData.area_name;
  const shopName = product.shop_name || product.vendor_shop_name || hubData.shop_name;
  const address = product.address || product.vendor_address || hubData.address;

  const distanceKm = calculateDistance(customerLat, customerLon, vendorLat, vendorLon);

  return {
    ...product,
    vendor_latitude: vendorLat,
    vendor_longitude: vendorLon,
    vendor_area_name: areaName,
    vendor_shop_name: shopName,
    vendor_address: address,
    distance_km: distanceKm
  };
}

/**
 * Filters product list to include ONLY products within maxKm (default 5 km) radius
 */
export function filterProductsWithinRadius(products = [], customerLat, customerLon, maxRadiusKm = 5.0) {
  if (!Array.isArray(products)) return [];

  const cLat = customerLat || DEFAULT_CUSTOMER_LOCATION.latitude;
  const cLon = customerLon || DEFAULT_CUSTOMER_LOCATION.longitude;

  return products
    .map(p => enrichProductLocation(p, cLat, cLon))
    .filter(p => p.distance_km <= maxRadiusKm)
    .sort((a, b) => a.distance_km - b.distance_km); // Sort nearest first
}
