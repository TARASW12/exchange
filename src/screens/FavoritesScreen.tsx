import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/store';
import { removeFavorite } from '../store/slices/favoritesSlice';
import { selectRatesStatus } from '../store/slices/ratesSlice';
import { selectFavoriteCryptoDetailsList } from '../store/selectors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const FavoritesScreen = () => {
  const dispatch = useAppDispatch();
  const ratesStatus = useAppSelector(selectRatesStatus);
  const favoriteRates = useAppSelector(selectFavoriteCryptoDetailsList);

  if (favoriteRates.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialCommunityIcons name="star-off-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No favorites yet.</Text>
        <Text style={styles.emptySubText}>Add some from the Exchange tab!</Text>
      </View>
    );
  }
  
  if (ratesStatus === 'loading' && favoriteRates.some(fr => fr.rate === undefined || fr.rate === null)) {
      return (
          <View style={[styles.container, styles.centered]}>
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
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => dispatch(removeFavorite(item.id))} style={styles.starButton}>
              <MaterialCommunityIcons name='star' size={24} color='#FFD700' />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <Text style={styles.itemSymbol}>{item.id}</Text>
              <Text style={styles.itemRate}>{item.rate ? item.rate.toFixed(6) + ' USD' : '-'}</Text>
            </View>
          </View>
        )}
      />
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
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
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
   text: {
    fontSize: 16,
    color: '#555',
  },
}); 