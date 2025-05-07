import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchRates, selectRatesStatus, selectRatesTimestamp } from '../store/slices/ratesSlice';

const REFETCH_INTERVAL = 2 * 60 * 1000;

export const useExchangeRates = (isRefreshing: boolean) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRatesStatus);
  const timestamp = useAppSelector(selectRatesTimestamp);

  useEffect(() => {
    const shouldFetch =
      status === 'idle' ||
      status === 'failed' ||
      (timestamp && (Date.now() - (timestamp * 1000)) > REFETCH_INTERVAL);

    if (shouldFetch && !isRefreshing) {
      dispatch(fetchRates());
    }

  }, [dispatch, status, timestamp, isRefreshing]);

};
