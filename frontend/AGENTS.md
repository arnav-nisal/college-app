This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

---

# College App Frontend Standards & Agent Instructions

## 1. Directory Structure Rules

All frontend application code must reside inside `src/`. Do not create top-level directories outside `src/` for application logic.

```
frontend/src/
├── app/                  # Expo Router file-based screens and routes ONLY
│   ├── (auth)/           # Authentication route group (e.g. login.tsx)
│   ├── (tabs)/           # Instagram-style 5-tab main layout
│   │   ├── _layout.tsx   # Native bottom tabs navigator
│   │   ├── index.tsx     # Home (Campus feed & highlights)
│   │   ├── notices.tsx   # Notices & circulars
│   │   ├── messages.tsx  # Direct & departmental chat
│   │   ├── exams.tsx     # Schedules, hall tickets, grades
│   │   └── profile.tsx   # Student / Staff ID card & settings
│   ├── onboarding.tsx    # Mandatory profile completion screen
│   └── _layout.tsx       # Root layout with AuthProvider & splash gating
├── components/           # Reusable UI components (cards, headers, buttons, chat bubbles)
├── services/             # API client services (fetch/axios wrappers, auth, WebSocket)
├── types/                # TypeScript interface definitions matching backend snake_case schemas
├── hooks/                # Custom React hooks (useAuth, useNotices, useChat)
├── utils/                # Helper utilities and formatters
└── theme/                # Design tokens, color palette, typography constants
```

- **Installing Libraries:** ALWAYS use `npx expo install <package-name>` so Expo CLI selects versions verified compatible with SDK 58.

---

## 2. Authentication & Navigation Flow

- **Domain Restriction:** Google Sign-In is strictly restricted to the official institutional hosted domain (`@despu.edu.in`).
- **Secure Token Storage:** Store the backend JWT bearer token exclusively in **`expo-secure-store`**. NEVER store JWTs in unencrypted `AsyncStorage` or global JavaScript memory.
- **Root Auth Gating in `src/app/_layout.tsx`:**
  The root layout initializes the authentication state before rendering screens:
  1. **Unauthenticated:** If no valid JWT is found in `expo-secure-store`, redirect immediately to `/login`.
  2. **Incomplete Profile (`is_profile_complete === false`):** If authenticated but onboarding has not been completed, redirect immediately to `/onboarding`.
  3. **Authenticated & Complete:** When authenticated and `is_profile_complete === true`, route directly to the main tab screen: `/(tabs)`.
- **API Communication:**
  - Base URL configured from environment variable (`EXPO_PUBLIC_API_URL`).
  - Axios or fetch interceptor attaches `Authorization: Bearer <token>` from SecureStore.
  - Automatically handle `401 Unauthorized` responses by clearing the stored token and resetting navigation to `/login`.

---

## 3. Mandatory Frontend Skill Triggers

Antigravity agents must trigger these specialized skills when working in `frontend/`:

| Skill | Trigger Conditions | Specific Instructions |
| :--- | :--- | :--- |
| **`@building-native-ui`** & **`@react-native-architecture`** | **Expo Router screens, 5-tab layout, and auth route gating** | Build native-feeling screens in `src/app/`, manage Instagram-style 5-tab navigation, handle `expo-secure-store` token persistence, and enforce root layout route gating (`/login` -> `/onboarding` -> `/(tabs)`). |
| **`@native-data-fetching`** & **`@frontend-api-integration-patterns`** | **FastAPI client services, WebSocket sync, caching, error normalization** | Build typed REST and WebSocket services in `src/services/`, attach `Authorization: Bearer` JWT headers, handle request deduplication/caching, retry logic, and clean loading/empty/error states. |
| **`@expo-dev-client`** | **Native modules, native configuration, and dev builds** | Trigger whenever configuring custom native modules such as Google Sign-In (`@react-native-google-signin/google-signin`), push notifications, or custom native config plugins requiring `npx expo run:ios|android` / EAS development builds. |
| **`@expo-tailwind-setup`**, **`@design-taste-frontend`**, & **`@ui-ux-pro-max`** | **Component styling, design system tokens, feeds, and polish** | Style components using Tailwind CSS / NativeWind via `src/global.css`, design the Instagram-style cards and bottom sheets, enforce safe area handling, keyboard avoidance in chat views, and deliver silky micro-interactions without generic slop. |
