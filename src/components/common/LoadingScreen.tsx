import React from "react";

import { CircularProgress } from "@mui/material";

const LoadingScreen: React.FC = () => {
  // Heartbeat animation for the icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-teal-50 to-white p-4">
      <CircularProgress size="3rem" color="primary" />
    </div>
  );
};

export default LoadingScreen;
