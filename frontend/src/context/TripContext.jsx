import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { tripService } from '../services/tripService.js';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [tripError, setTripError] = useState('');

  const refreshTrips = useCallback(async () => {
    setLoadingTrips(true);
    setTripError('');
    try {
      const payload = await tripService.getTrips();
      setTrips(payload.trips || []);
      return payload.trips || [];
    } catch (error) {
      setTripError(error.message);
      setTrips([]);
      return [];
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  const removeTrip = useCallback(async (tripId) => {
    await tripService.deleteTrip(tripId);
    setTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== tripId));
  }, []);

  const upsertTrip = useCallback((trip) => {
    setTrips((currentTrips) => {
      const exists = currentTrips.some((item) => item.id === trip.id);
      return exists ? currentTrips.map((item) => (item.id === trip.id ? trip : item)) : [trip, ...currentTrips];
    });
  }, []);

  const value = useMemo(
    () => ({ trips, loadingTrips, tripError, refreshTrips, removeTrip, upsertTrip }),
    [trips, loadingTrips, tripError, refreshTrips, removeTrip, upsertTrip]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used inside TripProvider');
  }
  return context;
}
