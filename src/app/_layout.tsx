import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { NunitoSans_600SemiBold, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Тримаємо системну заставку, поки вантажаться шрифти
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* «Почнімо» відкривається панеллю поверх слайдів; виїзд знизу анімує сам екран */}
        <Stack.Screen name="sign-in" options={{ presentation: 'transparentModal', animation: 'none' }} />
        {/* Вибір міста — така сама панель знизу, поверх головної */}
        <Stack.Screen name="city" options={{ presentation: 'transparentModal', animation: 'none' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
