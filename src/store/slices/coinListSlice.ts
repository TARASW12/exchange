import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiUtil } from "../../api";
import { RootState } from "../store";
import { createSelector } from "reselect";
import { DataStatus } from "../../constants";

export interface CoinDetail {
  symbol: string;
  name: string;
  name_full: string;
  max_supply: number | string;
  icon_url: string;
}
export interface CoinDetailsMap {
  [symbol: string]: CoinDetail;
}
interface CoinlayerListSuccessResponse {
  success: true;
  crypto: CoinDetailsMap;
}
interface CoinlayerListErrorResponse {
  success: false;
  error: { code: number; type: string; info: string };
}
type CoinlayerListApiResponse =
  | CoinlayerListSuccessResponse
  | CoinlayerListErrorResponse;

interface CoinListState {
  details: CoinDetailsMap;
  status: DataStatus;
  error: string | null;
  timestamp: number | null;
}

const initialState: CoinListState = {
  details: {},
  status: DataStatus.Idle,
  error: null,
  timestamp: null,
};

export const fetchCoinList = createAsyncThunk(
  "coinList/fetchCoinList",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiUtil.get<CoinlayerListApiResponse>("/list");
      if (data.success) {
        return { details: data.crypto, timestamp: Date.now() };
      } else {
        return rejectWithValue(data.error?.info || "Failed to fetch coin list");
      }
    } catch (error: any) {
      if (error.response?.data?.error?.info)
        return rejectWithValue(error.response.data.error.info);
      if (error.message) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error fetching coin list");
    }
  }
);

// --- Slice Definition ---
const coinListSlice = createSlice({
  name: "coinList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinList.pending, (state) => {
        state.status = DataStatus.Loading;
        state.error = null;
      })
      .addCase(
        fetchCoinList.fulfilled,
        (
          state,
          action: PayloadAction<{ details: CoinDetailsMap; timestamp: number }>
        ) => {
          state.status = DataStatus.Succeeded;
          state.details = action.payload.details;
          state.timestamp = action.payload.timestamp;
        }
      )
      .addCase(fetchCoinList.rejected, (state, action) => {
        state.status = DataStatus.Failed;
        state.error = action.payload as string;
      });
  },
});

// --- Selectors ---
export const selectCoinListMap = (state: RootState): CoinDetailsMap =>
  state.coinList.details;
export const selectCoinListStatus = (state: RootState): DataStatus =>
  state.coinList.status;
export const selectCoinListError = (state: RootState): string | null =>
  state.coinList.error;
export const selectCoinListTimestamp = (state: RootState): number | null =>
  state.coinList.timestamp;

export const selectCoinListArray = createSelector(
  [selectCoinListMap],
  (detailsMap): CoinDetail[] => {
    return Object.values(detailsMap || {});
  }
);

export default coinListSlice.reducer;
