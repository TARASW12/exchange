import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconName = () => {
          if (route.name === 'Exchange') {
            return 'currency-usd';
          } else if (route.name === 'Favorites') {
            return 'star';
          } else if (route.name === 'Crypto') {
            return 'bitcoin';
          }
          return 'help-circle';
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <MaterialCommunityIcons
              name={getIconName()}
              size={24}
              color={isFocused ? '#FF9500' : '#000'}
              style={styles.icon}
            />
            <Text style={[
              styles.label,
              isFocused && styles.activeLabel,
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#000',
  },
  activeLabel: {
    color: '#FF9500',
    fontWeight: '600',
  },
});
