import React from 'react';

const VideoCallContext = React.createContext({});

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <VideoCallContext.Provider value={{}}>
      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
