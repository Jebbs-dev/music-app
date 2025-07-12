import coverImage from "@/assets/images/background-image.png";
import { MusicType } from "@/modules/music/types/music";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import NeumorphicButton from "./neumorphic-button";
import RoundedButton from "./rounded-button";

const MusicList = () => {
  const { data, setSelectedTab, setSelectedSong } = useMusicData();
  const { currentSongIndex, setCurrentSongIndex, setIsPlaying } =
    useMusicControls();

  const handlePlaySong = (music: MusicType) => {
    setSelectedSong(music);
    setSelectedTab("playing");
    // Convert string id to number index (subtract 1 since array is 0-indexed)
    const songIndex = Number(music.id) - 1;
    setCurrentSongIndex(songIndex);
    setIsPlaying(true);
  };

  return (
    <View className="h-screen">
      <View
        className={
          "flex flex-row justify-between mx-7 items-center ios:mt-7 android:mt-14"
        }
      >
        <RoundedButton
          icon="arrow-back"
          onPress={() => setSelectedTab("playing")}
          className="p-4"
          color="#ccc"
        />
        <Text className="text-center mt-3 text-white font-semibold text-sm">
          MUSIC LIST
        </Text>
        <RoundedButton
          icon="search"
          onPress={() => null}
          className="p-4"
          color="#ccc"
        />
      </View>
      <View className="my-16">
        <View className="flex flex-row justify-between mx-7 items-center ">
          <NeumorphicButton
            icon="heart"
            onPress={() => null}
            className="p-4 bg-gray-700"
          />
          <View className="items-center border-2  rounded-lg border-[#2a2d2fcd] shadow-inner shadow-gray-700 mx-auto h-[200px] w-[200px]">
            <Image
              source={coverImage}
              alt="image"
              width={250}
              height={250}
              className="w-full h-full rounded-lg shadow-lg shadow-black"
            />
          </View>
          <NeumorphicButton
            icon="ellipsis-horizontal"
            onPress={() => setSelectedTab("list")}
            className="p-4 bg-gray-700"
          />
        </View>
      </View>
      <ScrollView>
        {data.map((music: MusicType, index) => (
          <TouchableOpacity
            key={music.id}
            onPress={() => handlePlaySong(music)}
            className={`flex-row justify-between items-center px-7 py-5 rounded-full ${currentSongIndex === index ? "bg-black mx-3" : ""}`}
          >
            <View className="">
              <Text className="text-white text-xl">{music.title}</Text>
              <Text className="text-gray-300 text-sm">{music.artist}</Text>
            </View>
            <NeumorphicButton
              icon="play"
              onPress={() => handlePlaySong(music)}
              className="p-4 bg-gray-700"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MusicList;
