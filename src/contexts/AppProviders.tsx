import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { LocationProvider } from './LocationContext';
import { BookingProvider } from './BookingContext';
import { AppProvider } from './AppContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers wrapper for the entire app
 * Wraps all context providers in the correct order
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AppProvider>
      <AuthProvider>
        <LocationProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </LocationProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default AppProviders;
