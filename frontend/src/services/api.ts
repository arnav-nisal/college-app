import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { OnboardingPayload, TokenResponse, User } from "../types/auth";

const TOKEN_KEY = "despu_auth_token";
const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function getStoredToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof window !== "undefined"
        ? window.localStorage.getItem(TOKEN_KEY)
        : null;
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveStoredToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (err) {
    console.warn("Failed to securely store auth token:", err);
  }
}

export async function removeStoredToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (err) {
    console.warn("Failed to remove stored auth token:", err);
  }
}

function normalizeErrorMessage(status: number, data: unknown): string {
  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;
    if (typeof payload.detail === "string") {
      return payload.detail;
    }
    if (Array.isArray(payload.detail)) {
      return payload.detail
        .map((item) => (item?.msg ? String(item.msg) : JSON.stringify(item)))
        .join(", ");
    }
    if (typeof payload.message === "string") {
      return payload.message;
    }
  }

  if (status === 403) {
    return "Access restricted: Only official @despu.edu.in accounts are permitted.";
  }
  if (status === 409) {
    return "College ID / PRN is already registered to another account.";
  }
  if (status === 401) {
    return "Session expired or invalid token. Please sign in again.";
  }
  return `Request failed with status ${status}`;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new ApiError(
      "Network connection failed. Please check your internet or server connection.",
      0,
      err
    );
  }

  let data: unknown = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const errorMsg = normalizeErrorMessage(res.status, data);
    throw new ApiError(errorMsg, res.status, data);
  }

  return data as T;
}

export async function loginWithGoogle(
  idToken: string
): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function getCurrentUser(): Promise<User> {
  return request<User>("/users/me", {
    method: "GET",
  });
}

export async function completeOnboarding(
  payload: OnboardingPayload
): Promise<User> {
  return request<User>("/users/me/onboarding", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
