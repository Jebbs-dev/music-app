import { View, Text, SafeAreaView, Image, ImageBackground } from "react-native";
import React from "react";
import { Artist } from "@/modules/music/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { useMusicData } from "@/store/music-data";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

const ArtistProfile = () => {
  const isPresented = router.canGoBack();

  const { currentArtist } = useMusicData();

  const image = { uri: String(currentArtist.image) };

  return (
    // <Animated.View
    //   entering={FadeIn}
    // >
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // style={{ flex: 1 }}
    >
      <View className="h-full">
        <ImageBackground
          source={image}
          resizeMode="cover"
          className="h-80 opacity-80"
        >
          <View className="flex flex-row justify-between items-center mx-7 mt-20">
            {isPresented && (
              <Link href="../">
                <Entypo name="chevron-thin-left" size={18} color="#fff" />
              </Link>
            )}
            <View className="flex flex-row gap-7">
              <SimpleLineIcons name="action-redo" size={18} color="white" />
              <Ionicons name="search-outline" size={18} color="white" />
            </View>
          </View>
        </ImageBackground>
        <View
          className="h-full"
          
        >
          <View className="-top-10 left-0 right-0 h-20 bg-black opacity-90 shadow-black shadow-2xl z-10" />
        </View>
      </View>
    </LinearGradient>
    // </Animated.View>
  );
};

export default ArtistProfile;
