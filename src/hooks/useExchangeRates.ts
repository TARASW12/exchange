import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  fetchRates,
  selectRatesStatus,
  selectRatesTimestamp,
} from "../store/slices/ratesSlice";
import { useNetworkStatus } from "./useNetworkStatus";
import { DataStatus } from "../constants";

const ONE_MINUTE_MS = 60 * 1000;

export const useExchangeRates = (isRefreshing: boolean) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRatesStatus);
  const storedTimestampInSeconds = useAppSelector(selectRatesTimestamp);
  const isOffline = useNetworkStatus();

  useEffect(() => {
    if (status === DataStatus.Loading) {
      return;
    }

    if (isOffline) {
      return;
    }

    const needsInitialFetch = status === DataStatus.Idle;
    const needsRetryFetch = status === DataStatus.Failed;
    const needsRefreshFetch = isRefreshing;
    const needsStaleDataFetch = (() => {
      if (status === DataStatus.Succeeded && storedTimestampInSeconds) {
        const storedTimestampInMilliseconds = storedTimestampInSeconds * 1000;
        return Date.now() - storedTimestampInMilliseconds > ONE_MINUTE_MS;
      }
      return false;
    })();

    if (
      needsInitialFetch ||
      needsRetryFetch ||
      needsRefreshFetch ||
      needsStaleDataFetch
    ) {
      dispatch(fetchRates());
    }
  }, [dispatch, status, storedTimestampInSeconds, isRefreshing, isOffline]);
};
