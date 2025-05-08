import { createSelector } from "reselect";
import { selectRatesMap } from "./slices/ratesSlice";
import { selectFavoriteIds } from "./slices/favoritesSlice";

export interface CryptoListItem {
  id: string;
  rate: number;
}

/**
 * Selects and sorts crypto rates for the Exchange screen.
 * Favorite items are listed first.
 * Memoized using reselect.
 */
export const selectSortedExchangeList = createSelector(
  [selectRatesMap, selectFavoriteIds], // Input selectors
  (rates, favoriteIds): CryptoListItem[] => {
    // Result function
    const data = Object.entries(rates).map(([key, value]) => ({
      id: key,
      rate: value,
    }));

    return data.sort((a, b) => {
      const aIsFavorite = favoriteIds.includes(a.id);
      const bIsFavorite = favoriteIds.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });
  }
);

/**
 * Selects details for only favorited crypto currencies.
 * Memoized using reselect.
 */
export const selectFavoriteCryptoDetailsList = createSelector(
  [selectRatesMap, selectFavoriteIds],
  (rates, favoriteIds): CryptoListItem[] => {
    return favoriteIds
      .map((id) => {
        if (rates[id]) {
          return { id, rate: rates[id] };
        }
        return null;
      })
      .filter((item) => item !== null) as CryptoListItem[];
  }
);
