import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiUtil } from "../../api";
import { RootState } from "../store";
import { DataStatus } from "../../constants";

export interface CryptoRates {
  [key: string]: number;
}
interface CoinlayerRateSuccessResponse {
  success: true;
  timestamp: number;
  rates: CryptoRates;
}
interface CoinlayerRateErrorResponse {
  success: false;
  error: { code: number; type: string; info: string };
}
type CoinlayerRateApiResponse =
  | CoinlayerRateSuccessResponse
  | CoinlayerRateErrorResponse;

interface RatesState {
  rates: CryptoRates;
  status: DataStatus;
  error: string | null;
  timestamp: number | null;
}

const initialState: RatesState = {
  rates: {},
  status: DataStatus.Idle,
  error: null,
  timestamp: null,
};

export const fetchRates = createAsyncThunk(
  "rates/fetchRates",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiUtil.get<CoinlayerRateApiResponse>("/live");
      if (data.success) {
        return { rates: data.rates, timestamp: data.timestamp };
      } else {
        return rejectWithValue(
          data.error?.info || "Failed to fetch crypto rates"
        );
      }
    } catch (error: any) {
      if (error.response?.data?.error?.info)
        return rejectWithValue(error.response.data.error.info);
      if (error.message) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error fetching crypto rates");
    }
  }
);

const ratesSlice = createSlice({
  name: "rates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.status = DataStatus.Loading;
        state.error = null;
      })
      .addCase(
        fetchRates.fulfilled,
        (
          state,
          action: PayloadAction<{ rates: CryptoRates; timestamp: number }>
        ) => {
          state.status = DataStatus.Succeeded;
          state.rates = action.payload.rates;
          state.timestamp = action.payload.timestamp;
        }
      )
      .addCase(fetchRates.rejected, (state, action) => {
        state.status = DataStatus.Failed;
        state.error = action.payload as string;
      });
  },
});

export const selectRatesMap = (state: RootState): CryptoRates =>
  state.rates.rates;
export const selectRatesStatus = (state: RootState): DataStatus =>
  state.rates.status;
export const selectRatesTimestamp = (state: RootState): number | null =>
  state.rates.timestamp;
export const selectRatesError = (state: RootState): string | null =>
  state.rates.error;

export default ratesSlice.reducer;
