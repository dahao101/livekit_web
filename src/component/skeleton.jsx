import React from "react";
import { Box, Skeleton, Typography, Avatar, Stack } from "@mui/material";

export default function LiveKitSkeleton() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        p: 3,
        backgroundColor: "#121212",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Preparing your call...
      </Typography>

      {/* Video Grid Placeholder */}
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {[...Array(4)].map((_, idx) => (
          <Box
            key={idx}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#1e1e1e",
              position: "relative",
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={180}
              sx={{ bgcolor: "#2a2a2a" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Skeleton variant="circular">
                <Avatar sx={{ width: 32, height: 32 }} />
              </Skeleton>
              <Skeleton
                variant="text"
                width={100}
                height={24}
                sx={{ ml: 2, bgcolor: "#333" }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 4, p: 2 }}
      >
        {[...Array(3)].map((_, idx) => (
          <Skeleton
            key={idx}
            variant="circular"
            width={50}
            height={50}
            sx={{ bgcolor: "#333" }}
          />
        ))}
      </Stack>
    </Box>
  );
}
