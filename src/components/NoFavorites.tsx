import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoFavoritesComponent = () => (
  <View style={[styles.container, styles.centered]}>
    <MaterialCommunityIcons name="star-off-outline" size={48} color="#ccc" />
    <Text style={styles.emptyText}>No favorites yet.</Text>
    <Text style={styles.emptySubText}>Add some from the Exchange tab!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#555",
    fontWeight: "bold",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});

export default NoFavoritesComponent;
