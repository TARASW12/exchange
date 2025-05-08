import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  fetchCoinList,
  selectCoinListStatus,
} from "../store/slices/coinListSlice";

export const useCoinList = (isRefreshing: boolean) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCoinListStatus);

  useEffect(() => {
    if ((status === "idle" || status === "failed") && !isRefreshing) {
      dispatch(fetchCoinList());
    }
  }, [dispatch, status, isRefreshing]);
};
