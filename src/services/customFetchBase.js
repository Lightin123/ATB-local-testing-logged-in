import { useState, useEffect } from 'react';

export function useCustomFetch(path, options) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');

    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`${baseUrl}${path}`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          ...options,
        });
        if (!res.ok) {
          throw new Error(res.statusText || 'Error');
        }
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [path, options]);

  return { data, isLoading, error };
}
