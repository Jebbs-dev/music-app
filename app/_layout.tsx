import { QueryProvider } from "@/providers/query-client-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";
import useAuthStore from "@/store/auth-store";
import { SplashScreenController } from './splash';


export default function RootLayout() {
  const { isLoggedIn } = useAuthStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryProvider>
      <SplashScreenController/>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen
              name="(home)"
              options={{ title: "Home", headerShown: false }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen
              name="auth"
              options={{
                presentation: "fullScreenModal",
                headerShown: false,
                animation: "fade",
              }}
            />
          </Stack.Protected>
        </Stack>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
