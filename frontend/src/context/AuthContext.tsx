import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  completeOnboarding,
  getCurrentUser,
  getStoredToken,
  loginWithGoogle,
  removeStoredToken,
  saveStoredToken,
} from "../services/api";
import { OnboardingPayload, User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signInWithGoogle: (idToken?: string) => Promise<User>;
  updateProfile: (payload: OnboardingPayload) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Google Sign In configuration
  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (webClientId && Platform.OS !== "web") {
      try {
        GoogleSignin.configure({
          webClientId,
          hostedDomain: "despu.edu.in",
          offlineAccess: false,
        });
      } catch (err) {
        console.warn("GoogleSignin.configure failed:", err);
      }
    }
  }, []);

  // Validate stored token on startup
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const storedToken = await getStoredToken();
        if (!storedToken) {
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
          return;
        }
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setToken(storedToken);
          setUser(currentUser);
        }
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 401) {
          await removeStoredToken();
        }
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signInWithGoogle = async (explicitIdToken?: string): Promise<User> => {
    let idToken = explicitIdToken;

    if (!idToken && Platform.OS !== "web") {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      // In @react-native-google-signin/google-signin v13+, idToken is in data.idToken
      idToken =
        signInResult.data?.idToken ||
        (signInResult as unknown as { idToken?: string }).idToken;
    }

    if (!idToken) {
      throw new Error("Unable to obtain Google ID Token.");
    }

    const tokenResponse = await loginWithGoogle(idToken);
    await saveStoredToken(tokenResponse.access_token);
    setToken(tokenResponse.access_token);
    setUser(tokenResponse.user);
    return tokenResponse.user;
  };

  const updateProfile = async (
    payload: OnboardingPayload
  ): Promise<User> => {
    const updatedUser = await completeOnboarding(payload);
    setUser(updatedUser);
    return updatedUser;
  };

  const signOut = async (): Promise<void> => {
    await removeStoredToken();
    setUser(null);
    setToken(null);

    if (Platform.OS !== "web") {
      try {
        await GoogleSignin.signOut();
      } catch {
        // Ignore signout error if session already revoked
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signInWithGoogle,
        updateProfile,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
