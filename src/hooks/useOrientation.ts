import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

type Orientation = 'portrait' | 'landscape';

/**
 * Custom hook to track device orientation
 */
export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'portrait'
      : 'landscape'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width < window.height ? 'portrait' : 'landscape');
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
