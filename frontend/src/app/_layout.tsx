import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RouteGate() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentSegment = segments[0] as string | undefined;
    const inLogin = currentSegment === "login";
    const inOnboarding = currentSegment === "onboarding";

    if (!user) {
      if (!inLogin) {
        router.replace("/login");
      }
    } else if (!user.is_profile_complete) {
      if (!inOnboarding) {
        router.replace("/onboarding");
      }
    } else {
      if (inLogin || inOnboarding) {
        router.replace("/(tabs)");
      }
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A0F1D",
        }}
      >
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGate />
    </AuthProvider>
  );
}
