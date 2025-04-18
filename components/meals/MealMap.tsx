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
  state: string;
  zipcode?: string;
  country?: string; // Added country for better geocoding
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

  // Ensure we have all restaurant data needed
  const restaurant = meal?.restaurant;

  // Memoize the address to prevent unnecessary re-renders and improve geocoding accuracy
  const fullAddress = useMemo(() => {
    if (!restaurant) return '';

    const { address, city, state, zipcode, country } = restaurant;
    // Add country (defaulting to Indonesia if not specified) for better geocoding
    const countryStr = country || 'Indonesia';

    return `${address}, ${city}, ${state} ${
      zipcode || ''
    }, ${countryStr}`.trim();
  }, [restaurant]);

  // Validate if we have enough address data to geocode
  const hasValidAddress = useMemo(() => {
    return !!(restaurant?.address && restaurant?.city && restaurant?.state);
  }, [restaurant]);

  useEffect(() => {
    if (!hasValidAddress) {
      setLoading(false);
      setError('INVALID_ADDRESS');
      return;
    }

    async function fetchCoordinates() {
      try {
        const data = await opencage.geocode({
          q: fullAddress,
          key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '',
          countrycode: 'id', // Limit results to Indonesia for better accuracy
          no_annotations: 1, // Reduce response size
        });

        if (data.status.code === 200 && data.results.length > 0) {
          const place = data.results[0];
          setCoordinates({
            lat: place.geometry.lat,
            lng: place.geometry.lng,
          });
          setLoading(false);
        } else {
          setLoading(false);
          setError('NO_RESULTS');
        }
      } catch (error: any) {
        setLoading(false);

        if (error.status?.code === 402) {
          setError('RATE_LIMIT');
          console.warn('OpenCage API: Daily quota exceeded');
        } else {
          setError('API_ERROR');
          console.error('Geocoding error:', error);
        }
      }
    }

    fetchCoordinates();
  }, [fullAddress, hasValidAddress]);

  // Initialize and cleanup map
  useEffect(() => {
    if (loading || !coordinates || !mapContainer.current) return;

    // Skip if map is already initialized
    if (map.current) return;

    // Initialize map
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) {
      console.error('MapTiler API key is missing');
      return;
    }

    maptilersdk.config.apiKey = apiKey;

    // Create map instance
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
    });

    // Add marker
    marker.current = new maptilersdk.Marker({
      color: '#FF0000',
      // Add popup with restaurant name if available
      ...(restaurant?.name && {
        popup: new maptilersdk.Popup().setText(restaurant.name),
      }),
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, loading, restaurant?.name]);

  if (loading) return <Loading />;

  if (error) {
    const errorMessages = {
      NO_RESULTS: 'Alamat restoran tidak ditemukan pada peta.',
      API_ERROR: 'Terjadi kesalahan saat memuat peta.',
      RATE_LIMIT: 'Batas penggunaan API tercapai, coba lagi nanti.',
      INVALID_ADDRESS: 'Data alamat restoran tidak lengkap.',
    };

    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
        <p className="text-amber-800 dark:text-amber-300 text-center">
          {errorMessages[error]}
        </p>
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
      {restaurant?.address && (
        <div className="p-4 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium">{restaurant.name}</p>
          <p>{fullAddress}</p>
        </div>
      )}
    </div>
  );
};

export default MealMap;
