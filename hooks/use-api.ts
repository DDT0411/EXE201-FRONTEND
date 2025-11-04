import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../lib/types/api';

// Generic API hook for handling API calls
export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
        return response;
      } else {
        setError(response.message || 'An error occurred');
        return response;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for handling paginated API calls
export function usePaginatedApi<T = any>() {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: (page: number, limit: number) => Promise<ApiResponse<{
      data: T[];
      pagination: typeof pagination;
    }>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(pagination.page, pagination.limit);
      
      if (response.success) {
        setData(response.data.data);
        setPagination(response.data.pagination);
        return response;
      } else {
        setError(response.message || 'An error occurred');
        return response;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const loadMore = useCallback(async (
    apiCall: (page: number, limit: number) => Promise<ApiResponse<{
      data: T[];
      pagination: typeof pagination;
    }>>
  ) => {
    if (pagination.page >= pagination.totalPages) return;
    
    setLoading(true);
    
    try {
      const nextPage = pagination.page + 1;
      const response = await apiCall(nextPage, pagination.limit);
      
      if (response.success) {
        setData(prev => [...prev, ...response.data.data]);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('Error loading more data:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  const reset = useCallback(() => {
    setData([]);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
    setError(null);
    setLoading(false);
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    execute,
    loadMore,
    reset,
    setPage,
    setLimit,
    hasMore: pagination.page < pagination.totalPages,
  };
}
