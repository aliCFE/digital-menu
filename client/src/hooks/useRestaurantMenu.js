import { useCallback, useEffect, useState } from 'react';
import { getPublicMenu, trackView } from '../services/restaurantService';

export function useRestaurantMenu(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPublicMenu(slug);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load menu.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    if (data) trackView(slug).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!data, slug]);

  return {
    restaurant: data?.restaurant,
    categories: data?.categories || [],
    items: data?.items || [],
    loading,
    error,
    refetch: fetchMenu,
  };
}
