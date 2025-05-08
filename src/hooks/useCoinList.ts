import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  fetchCoinList,
  selectCoinListStatus,
  selectCoinListTimestamp,
} from "../store/slices/coinListSlice";
import { useNetworkStatus } from "./useNetworkStatus";
import { DataStatus } from "../constants";

const ONE_HOUR_MS = 60 * 60 * 1000;

export const useCoinList = (isRefreshing: boolean) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCoinListStatus);
  const timestamp = useAppSelector(selectCoinListTimestamp);
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
    const needsStaleDataFetch =
      status === DataStatus.Succeeded &&
      timestamp &&
      Date.now() - timestamp > ONE_HOUR_MS;

    if (
      needsInitialFetch ||
      needsRetryFetch ||
      needsRefreshFetch ||
      needsStaleDataFetch
    ) {
      dispatch(fetchCoinList());
    }
  }, [dispatch, status, timestamp, isRefreshing, isOffline]);
};
