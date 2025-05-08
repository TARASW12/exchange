import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useAppSelector } from "../store/store";
import {
  selectCoinListArray,
  selectCoinListStatus,
  selectCoinListError,
  selectCoinListTimestamp,
  fetchCoinList,
  CoinDetail,
} from "../store/slices/coinListSlice";
import { useCoinList } from "../hooks/useCoinList";
import { DataStatusDisplay } from "../components/DataStatusDisplay";
import { useRefreshHandler } from "../hooks/useRefreshHandler";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const INITIAL_RENDER_COUNT = 20;
const RENDER_INCREMENT = 15;
const ONE_HOUR_MS = 60 * 60 * 1000;

export const CryptoScreen = () => {
  const fullCoinList = useAppSelector(selectCoinListArray);
  const status = useAppSelector(selectCoinListStatus);
  const error = useAppSelector(selectCoinListError);
  const isOffline = useNetworkStatus();

  const {
    displayedItems: displayedCoinList,
    loadMore: loadMoreItems,
    hasMore: hasMoreItems,
  } = useInfiniteScroll({
    fullData: fullCoinList,
    status,
    initialCount: INITIAL_RENDER_COUNT,
    increment: RENDER_INCREMENT,
  });

  const { isRefreshing, handleRefresh } = useRefreshHandler({
    onRefreshAction: fetchCoinList,
    timestampSelector: selectCoinListTimestamp,
    throttleDurationMs: ONE_HOUR_MS,
    checkOnlineStatus: true,
  });

  useCoinList(isRefreshing);

  return (
    <View style={styles.container}>
      <DataStatusDisplay
        status={status}
        error={error}
        dataLength={fullCoinList.length}
        isOffline={isOffline}
      >
        <FlatList
          data={displayedCoinList}
          keyExtractor={(item: CoinDetail) => item.symbol}
          renderItem={({ item }: { item: CoinDetail }) => (
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: item.icon_url }}
                style={styles.icon}
                onError={() =>
                  console.log("Failed to load icon:", item.icon_url)
                }
              />
              <View style={styles.textContainer}>
                <Text style={styles.itemSymbol}>{item.symbol}</Text>
                <Text style={styles.itemNameFull}>{item.name_full}</Text>
              </View>
            </View>
          )}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasMoreItems ? (
              <ActivityIndicator
                style={styles.footerLoader}
                size="small"
                color="#888"
              />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                if (isOffline) {
                  Alert.alert("Offline", "Cannot refresh data while offline.");
                } else {
                  handleRefresh();
                }
              }}
              tintColor="#FF9500"
              colors={["#FF9500"]}
            />
          }
        />
      </DataStatusDisplay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
  },
  itemSymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemNameFull: {
    fontSize: 14,
    color: "#666",
  },
  footerLoader: {
    marginVertical: 20,
  },
});
