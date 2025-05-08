# Crypto Exchange Rate Tracker

## 1. Overview

This application allows users to track live cryptocurrency exchange rates against a base currency (typically USD, as provided by the Coinlayer API). Users can:

- View a list of live exchange rates for various cryptocurrencies.
- Browse a comprehensive list of available cryptocurrencies with their details (name, symbol, icon).
- Mark cryptocurrencies as favorites for quick access.
- View their favorited cryptocurrencies on a dedicated screen.
- Access previously fetched data even when offline.

The app is built using Expo (React Native) and TypeScript.

## 2. Technical Description

### 2.1. How to Build and Run the App

**Prerequisites:**

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli` (or `yarn global add expo-cli`)
- An account with [Coinlayer](https://coinlayer.com/) to obtain an API access key.

**Setup and Running:**

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    This project uses `app.config.ts` to manage environment variables. You need to provide your Coinlayer API access key.

    - Create a file named `.env` in the root of the project (if one doesn't exist).
    - Add your Coinlayer API access key to the `.env` file:
      ```env
      EXPO_PUBLIC_COINLAYER_ACCESS_KEY=YOUR_COINLAYER_API_KEY
      ```
    - The `app.config.ts` file is already set up to load this variable.

4.  **Start the Development Server:**

    ```bash
    npm start
    # or
    yarn start
    # or
    npx expo start
    ```

5.  **Run on a Device/Emulator:**
    - The Expo development server will provide options to run the app on an Android emulator/device or an iOS simulator/device.
    - You will need the [Expo Go](https://expo.dev/expo-go) app installed on your physical device to run it there.

### 2.2. App Architecture and Design Choices

- **Framework:** Expo (React Native) for cross-platform (iOS and Android) mobile development.
- **Language:** TypeScript for enhanced code quality, type safety, and better developer experience.
- **State Management:**
  - **Redux Toolkit:** Used for predictable and centralized state management. It simplifies Redux development with features like `createSlice` for reducers and actions, and `createAsyncThunk` for handling asynchronous operations.
  - **React-Redux:** Official React bindings for Redux, allowing components to connect to the Redux store.
- **Data Persistence (Offline Mode):**
  - **Redux Persist:** To save parts of the Redux store (rates, coin list, favorites) to local device storage (`AsyncStorage`). This enables offline data access.
- **API Communication:**
  - **Axios:** A promise-based HTTP client for making API requests to the Coinlayer API. An `ApiUtil` module centralizes Axios instance configuration (base URL, timeout, default parameters like `access_key`).
- **Navigation:**
  - **React Navigation (`@react-navigation/bottom-tabs`):** Used for implementing tab-based navigation between the main screens of the app. A custom tab bar component enhances the look and feel.
- **Component Structure:**
  - Functional components with React Hooks are used throughout the application.
  - Reusable UI components are separated into the `src/components/` directory.
  - Screen-specific components reside in `src/screens/`.
- **Custom Hooks:** Logic common to multiple components or complex stateful logic within components is extracted into custom hooks (e.g., `useExchangeRates`, `useCoinList`, `useRefreshHandler`, `useNetworkStatus`) to promote reusability and separation of concerns.
- **Selectors:**
  - **Reselect:** Used to create memoized selectors for deriving data from the Redux store. This optimizes performance by preventing unnecessary recalculations and re-renders if the underlying data hasn't changed.

### 2.3. Description of App Structure and Major Components

The project follows a standard Expo/React Native project structure:

```
.
├── src/
│   ├── api/
│   │   └── index.ts             # Axios instance configuration and API utilities
│   ├── assets/                  # Static assets (e.g., images, fonts - though currently minimal)
│   ├── components/              # Reusable UI components
│   │   ├── AnimatedListItem.tsx   # Component for animated list items
│   │   ├── CustomTabBar.tsx       # Custom bottom tab bar
│   │   ├── DataStatusDisplay.tsx  # Handles loading, error, empty, offline states for data
│   │   ├── ListItemRowContent.tsx # Displays content for a single row in a list
│   │   └── NoFavorites.tsx        # Component shown when no favorites are present
│   ├── constants/
│   │   └── index.ts             # Application-wide constants (e.g., DataStatus enum)
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useCoinList.ts         # Hook for fetching and managing coin list data
│   │   ├── useExchangeRates.ts    # Hook for fetching and managing exchange rates
│   │   ├── useNetworkStatus.ts    # Hook to check network connectivity
│   │   └── useRefreshHandler.ts   # Hook for pull-to-refresh logic with throttling
│   ├── navigation/              # Navigation setup (Tab navigator, stack navigators if any)
│   │   └── AppNavigator.tsx       # (Likely contains the main TabNavigator)
│   ├── screens/                 # Screen components
│   │   ├── CryptoScreen.tsx       # Displays list of all cryptocurrencies
│   │   ├── ExchangeScreen.tsx     # Displays live exchange rates
│   │   └── FavoritesScreen.tsx    # Displays favorited cryptocurrencies
│   ├── store/                   # Redux store configuration
│   │   ├── slices/                # Redux state slices
│   │   │   ├── coinListSlice.ts   # Manages state for the list of all coins
│   │   │   ├── favoritesSlice.ts  # Manages state for user's favorite coins
│   │   │   └── ratesSlice.ts      # Manages state for live exchange rates
│   │   ├── selectors.ts           # Memoized selectors (using Reselect)
│   │   └── store.ts               # Redux store setup, middleware, and persistence config
│   └── types/                   # (Or inline) TypeScript type definitions and interfaces
├── App.tsx                      # Root application component, Redux Provider, PersistGate
├── app.config.ts                # Expo application configuration (replaces app.json)
├── babel.config.js              # Babel configuration
├── package.json                 # Project dependencies and scripts
└── README.md                    # This file
```

**Major Components/Modules:**

- **`App.tsx`:** Entry point of the React Native application. Sets up the Redux `Provider`, `PersistGate` for Redux Persist, and `SafeAreaProvider`. Renders the main navigation structure.
- **`src/store/store.ts`:** Configures the Redux store, including combining reducers from different slices, setting up middleware (like thunk for async actions, and middleware to ignore Redux Persist actions for serializability checks), and configuring `redux-persist` with `AsyncStorage`.
- **Slices (`src/store/slices/`)**: Each slice (`ratesSlice`, `coinListSlice`, `favoritesSlice`) defines its initial state, reducers for synchronous state updates, and async thunks (`fetchRates`, `fetchCoinList`) for API interactions.
- **Selectors (`src/store/selectors.ts`):** Provide optimized access to derived state from the Redux store. For example, `selectSortedExchangeList` and `selectFavoriteCryptoDetailsList` combine and transform data from multiple slices.
- **Screens (`src/screens/`)**:
  - `ExchangeScreen`: Fetches and displays live rates, supports pull-to-refresh, infinite scroll, and toggling favorites.
  - `CryptoScreen`: Fetches and displays a list of all cryptocurrencies with their details, supports pull-to-refresh and infinite scroll.
  - `FavoritesScreen`: Displays only the rates marked as favorites by the user.
- **Custom Hooks (`src/hooks/`)**: Encapsulate business logic such as data fetching strategies (including retries and stale data checks based on timestamps) and UI interaction patterns like pull-to-refresh.
- **API Utility (`src/api/index.ts`):** Configures a global Axios instance with base URL, timeout, and the API key automatically appended to requests.

### 2.4. Offline Mode Implementation

Offline capabilities are primarily achieved using **Redux Persist**:

1.  **Configuration:** In `src/store/store.ts`, `redux-persist` is configured to save specific slices of the Redux store (`rates`, `coinList`, `favorites`) to `AsyncStorage` (local device storage).
2.  **Hydration:** When the app starts, `PersistGate` delays rendering the main UI until the persisted state has been retrieved from `AsyncStorage` and rehydrated into the Redux store.
3.  **Data Fetching Hooks:**
    - Custom hooks like `useExchangeRates.ts` and `useCoinList.ts` incorporate logic to check the network status using the `useNetworkStatus` hook.
    - If the app is offline, these hooks typically avoid making new API calls, allowing the app to rely on the data already persisted in the Redux store.
    - They also manage timestamps for fetched data to determine if cached data is stale and needs refreshing when online.
4.  **UI Feedback:**
    - The `DataStatusDisplay.tsx` component is designed to show appropriate UI states based on data availability and network status. It can display messages like "You are offline. No data was previously saved." if the app is offline and no relevant data was found in the cache.
    - Screens generally display the cached data immediately if available, providing a seamless experience even without an active internet connection. Pull-to-refresh actions will only attempt to fetch new data if the device is online.

### 2.5. Additional Features or Libraries Used

- **`@expo/vector-icons`:** Provides a comprehensive set of icons (like MaterialCommunityIcons, FontAwesome) used throughout the application, especially in the custom tab bar and list items.
- **`react-native-safe-area-context`:** Used to handle safe areas on devices with notches or other intrusions, ensuring UI elements are not obscured. `SafeAreaProvider` is used in `App.tsx` and `useSafeAreaInsets` in components like `CustomTabBar.tsx`.
- **`react-native-reanimated`:** Powers the animations in `AnimatedListItem.tsx`, providing smooth transitions for favoriting/unfavoriting items and swipe-to-remove actions.
- **Pull-to-Refresh:** Implemented on data-heavy screens (`ExchangeScreen`, `CryptoScreen`, `FavoritesScreen`) using `RefreshControl` from React Native, managed by the `useRefreshHandler` custom hook which includes throttling to prevent excessive API calls.
- **Client-Side Infinite Scroll:** Basic implementation for lists on `ExchangeScreen` and `CryptoScreen` to improve performance with large datasets by rendering items on demand as the user scrolls.
- **Throttling:** Refresh actions are throttled (e.g., 1 minute for rates, 1 hour for coin list) to prevent hitting API rate limits and reduce unnecessary data fetching.
- **Animated List Items:** The `AnimatedListItem.tsx` component provides visual feedback or animations for list items, such as on interaction (e.g., swipe-to-remove for favorites).
- **Environment Variable Management:** `app.config.ts` along with `expo-constants` and a `.env` file are used to manage the Coinlayer API key, keeping it separate from the codebase.
