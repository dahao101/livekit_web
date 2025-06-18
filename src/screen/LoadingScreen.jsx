import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const mockToken = "sample_token_value";
      navigate(`/livekit-call/${mockToken}`);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <h2 style={{ color: "black" }}>Preparing your call...</h2>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    </>
  );
}
