import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Alert } from "react-native";
import { useNetworkStatus } from "./useNetworkStatus";

interface UseRefreshHandlerProps {
  onRefreshAction: any;
  timestampSelector: (state: any) => number | null;
  throttleDurationMs: number;
  checkOnlineStatus?: boolean; // Add optional prop
}

export const useRefreshHandler = ({
  onRefreshAction,
  timestampSelector,
  throttleDurationMs,
  checkOnlineStatus = false,
}: UseRefreshHandlerProps) => {
  const dispatch = useAppDispatch();
  const lastFetchedTimestamp = useAppSelector(timestampSelector);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isOffline = useNetworkStatus(); // Get network status

  const handleRefresh = useCallback(async () => {
    if (checkOnlineStatus && isOffline) {
      Alert.alert("Offline", "Cannot refresh data while offline.");
      setIsRefreshing(false);
      return;
    }

    const now = Date.now();
    if (
      lastFetchedTimestamp &&
      now - lastFetchedTimestamp < throttleDurationMs
    ) {
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);
    try {
      await dispatch(onRefreshAction()).unwrap();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    dispatch,
    onRefreshAction,
    lastFetchedTimestamp,
    throttleDurationMs,
    checkOnlineStatus,
    isOffline,
  ]);

  return { isRefreshing, handleRefresh };
};
