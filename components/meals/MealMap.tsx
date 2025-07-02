'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import opencage from 'opencage-api-client';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import Loading from './Loading';

interface Restaurant {
  name: string;
  address: string;
  city: string;
  state?: string; // ✅ Make optional
  zipcode?: string;
  country?: string;
}

interface Meal {
  restaurant: Restaurant;
}

interface MealMapProps {
  meal: Meal;
}

type GeocodingError =
  | 'NO_RESULTS'
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'INVALID_ADDRESS';

const MealMap = ({ meal }: MealMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<GeocodingError | null>(null);

  const restaurant = meal?.restaurant;

  // ✅ Optimized untuk hanya address + city
  const fullAddress = useMemo(() => {
    if (!restaurant) return '';

    const { address, city, state, country } = restaurant;

    // ✅ Build address step by step
    const addressParts = [];

    if (address) addressParts.push(address);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);

    // ✅ Add country default untuk Indonesia
    const finalCountry = country || 'Indonesia';
    addressParts.push(finalCountry);

    return addressParts.join(', ');
  }, [restaurant]);

  // ✅ Minimal validation - hanya butuh address + city
  const hasValidAddress = useMemo(() => {
    return !!(restaurant?.address && restaurant?.city);
  }, [restaurant]);

  // ✅ Enhanced geocoding dengan fallback strategy
  useEffect(() => {
    if (!hasValidAddress) {
      setLoading(false);
      setError('INVALID_ADDRESS');
      return;
    }

    async function fetchCoordinates() {
      try {
        // ✅ Strategy 1: Try full address first
        const geocodeQuery = fullAddress;

        console.log('🔍 [GEOCODING] Trying address:', geocodeQuery);

        let data = await opencage.geocode({
          q: geocodeQuery,
          key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '',
          countrycode: 'id',
          no_annotations: 1,
          limit: 5, // ✅ Get more results for better accuracy
        });

        // ✅ Strategy 2: If no results, try city only
        if (
          data.status.code === 200 &&
          data.results.length === 0 &&
          restaurant?.city
        ) {
          console.log('🔄 [GEOCODING] Fallback to city only:', restaurant.city);

          data = await opencage.geocode({
            q: `${restaurant.city}, Indonesia`,
            key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '',
            countrycode: 'id',
            no_annotations: 1,
            limit: 3,
          });
        }

        // ✅ Strategy 3: Try with different format
        if (data.status.code === 200 && data.results.length === 0) {
          console.log('🔄 [GEOCODING] Fallback to simplified format');

          data = await opencage.geocode({
            q: `${restaurant.address} ${restaurant.city}`,
            key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '',
            countrycode: 'id',
            no_annotations: 1,
          });
        }

        if (data.status.code === 200 && data.results.length > 0) {
          const place = data.results[0];

          console.log('✅ [GEOCODING] Success:', {
            address: geocodeQuery,
            coordinates: { lat: place.geometry.lat, lng: place.geometry.lng },
            confidence: place.confidence,
          });

          setCoordinates({
            lat: place.geometry.lat,
            lng: place.geometry.lng,
          });
          setLoading(false);
        } else {
          console.warn('❌ [GEOCODING] No results found for:', geocodeQuery);
          setLoading(false);
          setError('NO_RESULTS');
        }
      } catch (error: any) {
        console.error('❌ [GEOCODING] Error:', error);
        setLoading(false);

        if (error.status?.code === 402) {
          setError('RATE_LIMIT');
        } else {
          setError('API_ERROR');
        }
      }
    }

    fetchCoordinates();
  }, [fullAddress, hasValidAddress, restaurant]);

  // ✅ Map initialization (unchanged)
  useEffect(() => {
    if (loading || !coordinates || !mapContainer.current) return;
    if (map.current) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) {
      console.error('MapTiler API key is missing');
      return;
    }

    maptilersdk.config.apiKey = apiKey;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [coordinates.lng, coordinates.lat],
      zoom: 15, // ✅ Slightly higher zoom for city-level accuracy
    });

    marker.current = new maptilersdk.Marker({
      color: '#F59E0B', // ✅ Amber color to match theme
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // ✅ Add popup with restaurant info
    if (restaurant?.name) {
      const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${restaurant.name}</h3>
            <p class="text-sm text-gray-600">${restaurant.address}</p>
            <p class="text-sm text-gray-600">${restaurant.city}</p>
          </div>
        `);

      marker.current.setPopup(popup);
    }

    return () => {
      if (marker.current) marker.current.remove();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, loading, restaurant]);

  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessages = {
      NO_RESULTS:
        'Lokasi tidak ditemukan. Mungkin alamat tidak lengkap atau tidak valid.',
      API_ERROR: 'Terjadi kesalahan saat memuat peta. Silakan coba lagi.',
      RATE_LIMIT:
        'Batas penggunaan peta tercapai. Coba lagi dalam beberapa saat.',
      INVALID_ADDRESS:
        'Data alamat tidak lengkap. Diperlukan minimal alamat dan kota.',
    };

    return (
      <div className="rounded-xl overflow-hidden border-2 border-amber-200 dark:border-amber-800 shadow-lg">
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20">
          <div className="text-center">
            <div className="text-4xl mb-2">📍</div>
            <p className="text-amber-800 dark:text-amber-300 font-medium">
              {errorMessages[error]}
            </p>
            {restaurant?.address && restaurant?.city && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Alamat:</strong> {restaurant.address}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Kota:</strong> {restaurant.city}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-lg">
      <div
        ref={mapContainer}
        style={{ height: '500px', width: '100%' }}
        className="map"
      />
      {restaurant && (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="text-amber-500 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              {restaurant.name && (
                <p className="font-semibold text-gray-900 dark:text-white">
                  {restaurant.name}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {restaurant.address}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {restaurant.city}
                {restaurant.state && `, ${restaurant.state}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealMap;
