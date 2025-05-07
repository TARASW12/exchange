import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchRates, selectRatesStatus, selectRatesError, selectRatesTimestamp } from '../store/slices/ratesSlice';
import { addFavorite, removeFavorite, selectFavoriteIds } from '../store/slices/favoritesSlice';
import { selectSortedExchangeList } from '../store/selectors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { DataStatusDisplay } from '../components/DataStatusDisplay';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const ONE_MINUTE_MS = 60 * 1000;
const INITIAL_RATES_RENDER_COUNT = 25;
const RATES_RENDER_INCREMENT = 20;

export const ExchangeScreen = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectRatesStatus);
  const error = useAppSelector(selectRatesError);
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const fullSortedDataForList = useAppSelector(selectSortedExchangeList);

  const { displayedItems: displayedDataForList, loadMore: loadMoreRates, hasMore: hasMoreRates } = useInfiniteScroll({
    fullData: fullSortedDataForList,
    status,
    initialCount: INITIAL_RATES_RENDER_COUNT,
    increment: RATES_RENDER_INCREMENT,
  });

  const { isRefreshing, handleRefresh } = useRefreshHandler({
    onRefreshAction: fetchRates,
    timestampSelector: selectRatesTimestamp,
    throttleDurationMs: ONE_MINUTE_MS,
  });

  useExchangeRates(isRefreshing);

  const handleToggleFavorite = (id: string) => {
    if (favoriteIds.includes(id)) {
      dispatch(removeFavorite(id));
    } else {
      dispatch(addFavorite(id));
    }
  };

  return (
    <View style={styles.container}>
      <DataStatusDisplay
        status={status}
        error={error}
        dataLength={fullSortedDataForList.length} 
      >
        <FlatList
          data={displayedDataForList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isFavorite = favoriteIds.includes(item.id);
            return (
              <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => handleToggleFavorite(item.id)} style={styles.starButton}>
                  <MaterialCommunityIcons
                    name={isFavorite ? 'star' : 'star-outline'}
                    size={24}
                    color={isFavorite ? '#FFD700' : '#8e8e93'}
                  />
                </TouchableOpacity>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemSymbol}>{item.id}</Text>
                  <Text style={styles.itemRate}>{item.rate.toFixed(6)} USD</Text>
                </View>
              </View>
            );
          }}
          ListHeaderComponent={() => {
            const timestamp = useAppSelector(selectRatesTimestamp);
            return (
              <View>
                {status === 'loading' && !isRefreshing && <ActivityIndicator color="#FF9500" style={styles.inlineLoader} />}
                {typeof timestamp === 'number' && <Text style={styles.timestampText}>Last updated: {new Date(timestamp * 1000).toLocaleString()}</Text>}
              </View>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF9500"
              colors={["#FF9500"]} 
            />
          }
          onEndReached={loadMoreRates}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasMoreRates ?
            <ActivityIndicator style={styles.footerLoader} size="small" color="#888" /> : null
          }
        />
      </DataStatusDisplay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  centered: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  errorDetailText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  starButton: {
    paddingRight: 12,
    paddingVertical: 5,
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemRate: {
    fontSize: 16,
    color: '#007AFF',
  },
  timestampText: {
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 12,
    color: '#777',
    backgroundColor: '#e9e9e9',
  },
  inlineLoader: {
    marginVertical: 10,
  },
  footerLoader: {
      marginVertical: 20,
  }
});
