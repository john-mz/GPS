import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import PermisionsCheckerProvider from '@/presentation/providers/PermisionsCheckerProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout(){
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PermisionsCheckerProvider>
                <Stack screenOptions={{ headerShown: false }} >
                    <Stack.Screen name="loading/index" options={{ animation: 'none' }} />
                    <Stack.Screen name="map/index" options={{ animation: 'fade' }} />
                    <Stack.Screen name="options/index" options={{ animation: 'fade' }} />
                </Stack>
            </PermisionsCheckerProvider>
        </GestureHandlerRootView>
    )
}