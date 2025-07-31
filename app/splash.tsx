import useAuthStore from '@/store/auth-store';
import { SplashScreen } from 'expo-router';


export function SplashScreenController() {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    SplashScreen.hideAsync();
  }

  return null;
}