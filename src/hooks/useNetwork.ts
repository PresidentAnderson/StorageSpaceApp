import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * Custom hook to monitor network connectivity
 */
export const useNetwork = () => {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(setNetworkState);

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(setNetworkState);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isConnected: networkState?.isConnected ?? true,
    isInternetReachable: networkState?.isInternetReachable ?? true,
    type: networkState?.type,
    details: networkState?.details,
  };
};

export default useNetwork;
