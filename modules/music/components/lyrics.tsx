import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useMusicData } from "@/store/music-data";

const Lyrics = () => {
  const { selectedSong } = useMusicData();

  const formattedLyrics = selectedSong?.lyrics
    .replace(/^"|"$/g, "") // remove leading/trailing quotes
    .replace(/\\n/g, "\n") // replace escaped newlines with real line breaks
    .replace(/\\"/g, '"'); // unescape quotes if needed

  return (
    <View className="h-full">
      <ScrollView showsVerticalScrollIndicator={false} className="mb-40">
        <Text
          style={{
            fontFamily: "serif",
            lineHeight: 22,
          }}
          className="whitespace-pre-wrap text-white mt-8 mx-4 overflow-auto"
        >
          {formattedLyrics || "No lyrics available for this song."}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Lyrics;
