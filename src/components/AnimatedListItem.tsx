import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface AnimatedListItemProps {
  isFavorite: boolean;
  children: React.ReactNode;
  itemKey: string;
  onAnimationComplete?: (key: string) => void;
  isNewlyFavorited?: boolean;
  isNewlyUnfavorited?: boolean;
}

const ANIMATION_DURATION = 500;
const OPACITY_DURATION = ANIMATION_DURATION / 2.5;

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  isFavorite,
  children,
  itemKey,
  onAnimationComplete,
  isNewlyFavorited,
  isNewlyUnfavorited,
}) => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isNewlyFavorited) {
      translateX.value = -width;
      opacity.value = 0;
      translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    } else if (isNewlyUnfavorited) {
      if (onAnimationComplete) {
        translateX.value = withTiming(width, { duration: ANIMATION_DURATION });
        opacity.value = withTiming(
          0,
          { duration: ANIMATION_DURATION * 0.8 },
          (finished) => {
            if (finished) {
              runOnJS(onAnimationComplete)(itemKey);
            }
          }
        );
      } else {
        opacity.value = withTiming(
          0,
          { duration: OPACITY_DURATION },
          (finishedFadingOut) => {
            if (finishedFadingOut) {
              translateX.value = width;
              translateX.value = withTiming(0, {
                duration: ANIMATION_DURATION,
              });
              opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
            }
          }
        );
      }
    } else {
      if (translateX.value !== 0) {
        translateX.value = withTiming(0, { duration: ANIMATION_DURATION / 2 });
      }
      if (opacity.value !== 1) {
        opacity.value = withTiming(1, { duration: ANIMATION_DURATION / 2 });
      }
    }
  }, [
    isNewlyFavorited,
    isNewlyUnfavorited,
    itemKey,
    onAnimationComplete,
    width,
    isFavorite,
    translateX,
    opacity,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});
