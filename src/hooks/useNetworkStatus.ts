import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOffline(!(state.isConnected && state.isInternetReachable));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isOffline;
};
