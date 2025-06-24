import { useMusicData } from "@/store/music-data";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native";
import MusicList from "./MusicList";
import Playing from "./Playing";

const Layout = () => {
  const { selectedTab } = useMusicData();

  return (
    <>
      <LinearGradient
      
          colors={["#7A0C15", "#181818", "#000000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // style={{ flex: 1 }}
        >
   
      
        <SafeAreaView>
          {selectedTab === "list" ? <MusicList /> : <Playing />}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Layout;
