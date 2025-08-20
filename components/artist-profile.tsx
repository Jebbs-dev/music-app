import RoundedButton from "@/components/rounded-button";
import { Album, Artist, SongData } from "@/modules/music/types/types";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import { chunkIntoRows } from "@/utils/chunk-into-rows";
import { useMusicContextActions } from "@/utils/music-context-helpers";
import { getYear } from "@/utils/time-format";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createArtistRadio } from "@/utils/music-context-helpers";
import { useLocalSearchParams, useRouter } from "expo-router";

interface MediaImageProps {
  coverImage?: string | any;
  size: number;
  className?: string;
}

const MediaImage: React.FC<MediaImageProps> = ({
  coverImage,
  size,
  className = "",
}) => {
  const imageStyle = `w-${size} h-${size} rounded-md ${className}`;

  if (coverImage) {
    return (
      <View className={imageStyle}>
        <Image
          source={
            typeof coverImage === "string" ? { uri: coverImage } : coverImage
          }
          alt="media image"
          className="w-full h-full rounded-md"
        />
      </View>
    );
  }

  return <View className={`${imageStyle} bg-gray-600`} />;
};

const ArtistProfile = () => {
  const MAX_ROWS = 4;

  const { artistsData, albumsData, data } = useMusicData();

  const { setArtistModalVisible, setSearchModalVisible } = useMusicView();

  const { startArtistRadio } = useMusicContextActions();

  const router = useRouter();

  const { artistId } = useLocalSearchParams();

  const currentArtist: Artist | undefined = artistsData.find(
    (artist) => artist.id === artistId
  );

  const artistSongs: SongData[] | undefined = data.filter(
    (song) => song.artistId === currentArtist?.id
  );

  const artistAlbums: Album[] | undefined = albumsData.filter(
    (album) => album.artistId === currentArtist?.id
  );

  const rows = chunkIntoRows(artistSongs || [], MAX_ROWS);

  const image = { uri: String(currentArtist?.image) };

  const singles = artistSongs?.filter((song) => song.albumId === null);

  const handlePlayArtistSongs = () => {
    if (currentArtist && artistSongs && artistSongs.length > 0) {
      const firstSong = artistSongs[0];

      startArtistRadio(firstSong);
    }
  };

  return (
    <View className="flex-1 bg-black/95">
      <View className="h-full">
        <LinearGradient
          colors={["transparent", "#181818", "#000000"]}
          style={{
            position: "absolute",
            zIndex: 99,
            height: "100%",
            width: "100%",
          }}
        >
          <SafeAreaView className="h-full" style={{ zIndex: 9999 }}>
            <View className="flex flex-row justify-between items-center mt-10 android:mt-20 mx-7 bg-transparent">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <Entypo name="chevron-thin-left" size={18} color="white" />
              </TouchableOpacity>

              <View className="flex flex-row gap-7">
                <SimpleLineIcons name="action-redo" size={18} color="white" />
                <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
                  <Ionicons name="search-outline" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 180 }}
            >
              <View className="mt-48 mx-7 ">
                <Text className="text-4xl font-bold text-white ">
                  {currentArtist?.name}
                </Text>
                <Text className="text-sm text-white mt-2" numberOfLines={1}>
                  {currentArtist?.description}
                </Text>
              </View>

              <View className="flex flex-row justify-between items-center mt-5 mx-7 ">
                <TouchableOpacity className="px-5 py-3 bg-white rounded-full">
                  <Text className="font-semibold">Subscribe</Text>
                </TouchableOpacity>

                <View className="flex flex-row items-center gap-5">
                  <View>
                    <TouchableOpacity className="flex flex-row items-center gap-2 px-5 py-3 rounded-full bg-gray-600/20">
                      <Feather name="radio" size={16} color="white" />
                      <Text className="font-semibold text-white">Radio</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <RoundedButton
                      icon="play"
                      iconType="ionicon"
                      onPress={handlePlayArtistSongs}
                      color="black"
                      className="p-4 bg-white"
                    />
                  </View>
                </View>
              </View>

              <View className="mt-10">
                <View className="flex flex-row justify-between items-center mx-7 ">
                  <Text className="text-white font-semibold text-2xl">
                    Top Songs
                  </Text>
                  <View className="flex flex-row items-center gap-3">
                    <TouchableOpacity className="px-2 py-1 border border-gray-700 rounded-full">
                      <Text className="text-xs text-white font-semibold">
                        Play all
                      </Text>
                    </TouchableOpacity>
                    <Entypo name="chevron-thin-right" size={16} color="white" />
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex flex-col gap-4 mx-7">
                    {rows?.map((row, rowIndex) => (
                      <View key={rowIndex} className="flex flex-row gap-4">
                        {row?.map((item: SongData, colIndex: number) => (
                          <TouchableOpacity key={`${rowIndex}-${colIndex}`}>
                            <View className="max-w-[320px] flex flex-row items-center justify-between py-3">
                              <View className="flex flex-row items-center">
                                <MediaImage
                                  coverImage={item.coverImage}
                                  size={14}
                                />
                                <View className="flex flex-col gap-1 ml-5">
                                  <Text
                                    className="text-white font-semibold truncate w-64"
                                    numberOfLines={1}
                                  >
                                    {item.title}
                                  </Text>
                                  <View className="flex flex-row gap-3">
                                    <Text className="text-gray-300">
                                      <Text>{item.artist?.name}</Text>
                                      <Entypo
                                        name="dot-single"
                                        size={18}
                                        color="gray"
                                      />{" "}
                                      {/* TODO: Replace with actual content */}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              <MaterialCommunityIcons
                                name="dots-vertical"
                                size={24}
                                color="white"
                              />
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <View className="mt-5 mx-7">
                  <View>
                    <Text className="text-white font-semibold text-2xl">
                      Albums
                    </Text>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {artistAlbums?.map((album, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          router.navigate(`/(home)/albums/${album.id}`);
                        }}
                      >
                        <View className="mr-4 mt-5">
                          <MediaImage coverImage={album.coverImage} size={40} />

                          <Text className="text-white text-lg font-semibold mt-2">
                            {album.title}
                          </Text>
                          <Text className="text-gray-400">
                            {album.releaseDate &&
                              getYear(String(album.releaseDate))}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View className="mt-10 mx-5">
                  <View>
                    <Text className="text-white font-semibold text-2xl">
                      Singles
                    </Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {singles?.map((song, idx) => (
                      <View key={idx} className="mr-4 mt-5 w-40">
                        <View className="h-40 w-40 rounded-md bg-white/30">
                          {typeof song.coverImage === "string" ? (
                            <Image
                              source={
                                typeof song.coverImage === "string"
                                  ? { uri: song.coverImage }
                                  : song.coverImage
                              }
                              alt="image"
                              width={25}
                              height={25}
                              className="w-full h-full rounded-md"
                            />
                          ) : (
                            <View className="h-40 w-40 rounded-md bg-white/30" />
                          )}
                        </View>

                        <Text className="text-white text-lg font-semibold mt-2">
                          {song.title}
                        </Text>
                        <Text className="text-gray-400">
                          {song.releaseDate &&
                            getYear(String(song.releaseDate))}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
        <ImageBackground
          source={image}
          resizeMode="cover"
          className="h-80 opacity-90"
        ></ImageBackground>
      </View>
    </View>
  );
};

export default ArtistProfile;
