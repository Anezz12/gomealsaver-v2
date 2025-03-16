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
}

interface Meal {
  restaurant: Restaurant;
}

interface MealMapProps {
  meal: Meal;
}

const MealMap = ({ meal }: MealMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [geoCodeError, setGeoCodeError] = useState<boolean>(false);

  // Memoize the address to prevent unnecessary re-renders
  const fullAddress = useMemo(() => {
    const { address, city, state, zipcode } = meal.restaurant;
    return `${address} ${city} ${state} ${zipcode || ''}`;
  }, [meal.restaurant]);

  useEffect(() => {
    async function fetchCoordinates() {
      try {
        const data = await opencage.geocode({
          q: fullAddress,
          key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '',
        });

        if (data.status.code === 200 && data.results.length > 0) {
          const place = data.results[0];
          setLat(place.geometry.lat);
          setLng(place.geometry.lng);
          setLoading(false);
        } else {
          setLoading(false);
          setGeoCodeError(true);
        }
      } catch (error: any) {
        setLoading(false);
        setGeoCodeError(true);

        if (error.status?.code === 402) {
          console.log('hit free trial daily limit');
          console.log('become a customer: https://opencagedata.com/pricing');
        }
      }
    }

    fetchCoordinates();
  }, [fullAddress]);

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once
    if (!loading && lat !== null && lng !== null) {
      maptilersdk.config.apiKey =
        process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';
      map.current = new maptilersdk.Map({
        container: mapContainer.current as HTMLElement,
        style: maptilersdk.MapStyle.STREETS,
        center: [lng, lat],
        zoom: 14,
      });
      new maptilersdk.Marker({ color: '#FF0000' })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }
  }, [lng, lat, loading]);

  if (loading) return <Loading />;
  if (geoCodeError)
    return <div className="text-xl">No restaurant data found</div>;

  return (
    <div
      ref={mapContainer}
      style={{ height: '500px', width: '100%' }}
      className="map"
    />
  );
};

export default MealMap;
