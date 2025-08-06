import { useMusicControls } from "@/store/music-controls";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Lyrics = () => {
  const { currentSong } = useMusicControls();

  const formattedLyrics = currentSong?.lyrics
    .replace(/^"|"$/g, "") // remove leading/trailing quotes
    .replace(/\\n/g, "\n") // replace escaped newlines with real line breaks
    .replace(/\\"/g, '"'); // unescape quotes if needed

  return (
    <View className="h-full">
      {formattedLyrics && formattedLyrics.trim() ? (
        <ScrollView showsVerticalScrollIndicator={false} className="mb-40">
          <Text
            style={{
              fontFamily: "serif",
              lineHeight: 22,
            }}
            className="whitespace-pre-wrap text-white mt-8 mx-4 overflow-auto"
          >
            {formattedLyrics}
          </Text>
        </ScrollView>
      ) : (
        <View className="flex flex-1 items-center justify-center">
          <Text>No lyrics available for this song.</Text>
        </View>
      )}
    </View>
  );
};

export default Lyrics;
