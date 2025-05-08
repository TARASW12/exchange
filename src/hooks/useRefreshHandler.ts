import { useState, useCallback } from "react";
import { Action, ThunkAction } from "@reduxjs/toolkit"; // Import necessary types
import { useAppDispatch, useAppSelector, RootState } from "../store/store";

interface UseRefreshHandlerProps {
  onRefreshAction: () => ThunkAction<Promise<any>, RootState, any, Action>;
  timestampSelector: (state: RootState) => number | null;
  throttleDurationMs: number;
}

export const useRefreshHandler = ({
  onRefreshAction,
  timestampSelector,
  throttleDurationMs,
}: UseRefreshHandlerProps) => {
  const dispatch = useAppDispatch();
  const timestamp = useAppSelector(timestampSelector);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    const now = Date.now();
    const lastFetchTime = timestamp || 0;

    if (lastFetchTime && now - lastFetchTime < throttleDurationMs) {
      console.log("Refresh throttled.");

      return;
    }

    setIsRefreshing(true);
    try {
      await dispatch(onRefreshAction());
    } catch (refreshError) {
      console.error("Refresh action failed:", refreshError);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, timestamp, throttleDurationMs, onRefreshAction]);

  return {
    isRefreshing,
    handleRefresh,
  };
};
