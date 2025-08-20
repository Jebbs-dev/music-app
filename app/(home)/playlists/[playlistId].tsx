import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import PlaylistModal from "@/components/playlist-modal";

const PlaylistPage = () => {
  const modalOpacity = useSharedValue(0);

  React.useEffect(() => {
    modalOpacity.value = withTiming(1, {
      duration: 300,
    });
  }, [modalOpacity]);

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
    };
  });

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 bottom-0 z-40"
      style={modalAnimatedStyle}
      pointerEvents="box-none"
    >
      <PlaylistModal />
    </Animated.View>
  );
};

export default PlaylistPage;
