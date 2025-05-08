import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useAppSelector, useAppDispatch } from "../store/store";
import { removeFavorite } from "../store/slices/favoritesSlice";
import { selectRatesStatus } from "../store/slices/ratesSlice";
import { selectFavoriteCryptoDetailsList } from "../store/selectors";
import { AnimatedListItem } from "../components/AnimatedListItem";
import { ListItemRowContent } from "../components/ListItemRowContent";
import NoFavoritesComponent from "../components/NoFavorites";

interface ItemBeingRemovedState {
  key: string | null;
}

export const FavoritesScreen = () => {
  const dispatch = useAppDispatch();
  const ratesStatus = useAppSelector(selectRatesStatus);
  const favoriteRates = useAppSelector(selectFavoriteCryptoDetailsList);

  const [itemBeingRemoved, setItemBeingRemoved] =
    useState<ItemBeingRemovedState>({ key: null });

  const handleRemoveFavoriteCallback = useCallback((id: string) => {
    setItemBeingRemoved({ key: id });
  }, []);

  const onSwipeOutComplete = useCallback(
    (key: string) => {
      dispatch(removeFavorite(key));
      setItemBeingRemoved({ key: null });
    },
    [dispatch]
  );

  if (favoriteRates.length === 0) {
    return <NoFavoritesComponent />;
  }

  if (
    ratesStatus === "loading" &&
    favoriteRates.some((fr) => fr.rate === undefined || fr.rate === null)
  ) {
    return (
      <View style={[styles.container, styles.centeredLoading]}>
        <Text style={styles.text}>Loading rate data for favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteRates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimatedListItem
            itemKey={item.id}
            isFavorite={true}
            isNewlyUnfavorited={itemBeingRemoved.key === item.id}
            onAnimationComplete={onSwipeOutComplete}
          >
            <ListItemRowContent
              id={item.id}
              rate={item.rate}
              isFavorite={true}
              onToggleFavorite={handleRemoveFavoriteCallback}
            />
          </AnimatedListItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  centeredLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  itemContainer: {},
  starButton: {},
  itemDetails: {},
  itemSymbol: {},
  itemRate: {},
  text: {
    fontSize: 16,
    color: "#555",
  },
});
