import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { DashboardLayoutProvider } from '../../contexts/DashboardLayoutContext';
import { VideoCallProvider } from '../../contexts/VideoCallContext';
import { AIToolsProvider } from '../AIToolsProvider';
import { ModalsProvider } from '../ModalsProvider';
import { VideoCallErrorBoundary } from '../VideoCallErrorBoundary';

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <VideoCallErrorBoundary>
          <VideoCallProvider>
            <AIToolsProvider>
              <NavigationProvider>
                <DashboardLayoutProvider>
                  <ModalsProvider>
                    {children}
                  </ModalsProvider>
                </DashboardLayoutProvider>
              </NavigationProvider>
            </AIToolsProvider>
          </VideoCallProvider>
        </VideoCallErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
};
