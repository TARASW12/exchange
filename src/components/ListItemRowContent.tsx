import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ListItemRowContentProps {
  id: string;
  rate?: number | string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  itemContainerStyle?: StyleProp<ViewStyle>;
  starButtonStyle?: StyleProp<ViewStyle>;
  itemDetailsStyle?: StyleProp<ViewStyle>;
  itemSymbolStyle?: StyleProp<TextStyle>;
  itemRateStyle?: StyleProp<TextStyle>;
}

export const ListItemRowContent: React.FC<ListItemRowContentProps> = ({
  id,
  rate,
  isFavorite,
  onToggleFavorite,
  itemContainerStyle,
  starButtonStyle,
  itemDetailsStyle,
  itemSymbolStyle,
  itemRateStyle,
}) => {
  const displayRate =
    typeof rate === "number" ? rate.toFixed(6) + " USD" : rate || "-";

  return (
    <View style={[styles.defaultItemContainer, itemContainerStyle]}>
      <TouchableOpacity
        onPress={() => onToggleFavorite(id)}
        style={[styles.defaultStarButton, starButtonStyle]}
      >
        <MaterialCommunityIcons
          name={isFavorite ? "star" : "star-outline"}
          size={24}
          color={isFavorite ? "#FFD700" : "#8e8e93"}
        />
      </TouchableOpacity>
      <View style={[styles.defaultItemDetails, itemDetailsStyle]}>
        <Text style={[styles.defaultItemSymbol, itemSymbolStyle]}>{id}</Text>
        <Text style={[styles.defaultItemRate, itemRateStyle]}>
          {displayRate}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  defaultStarButton: {
    paddingRight: 12,
    paddingVertical: 5,
  },
  defaultItemDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  defaultItemSymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  defaultItemRate: {
    fontSize: 16,
    color: "#007AFF",
  },
});
