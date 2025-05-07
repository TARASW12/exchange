import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import favoritesReducer from './slices/favoritesSlice';
import ratesReducer from './slices/ratesSlice';
import coinListReducer from './slices/coinListSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['favorites', 'rates', 'coinList'], 
};

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  rates: ratesReducer,
  coinList: coinListReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE', 
          'rates/fetchRates/pending',
          'rates/fetchRates/fulfilled',
          'rates/fetchRates/rejected',
          'coinList/fetchCoinList/pending',
          'coinList/fetchCoinList/fulfilled',
          'coinList/fetchCoinList/rejected',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
