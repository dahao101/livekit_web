import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";

const LiveKitRoom = React.lazy(() =>
  import("@livekit/components-react").then((mod) => ({
    default: mod.LiveKitRoom,
  }))
);

export default function LiveKitWebView() {
  const { id } = useParams();

  return (
    <Suspense fallback={<div>Loading LiveKit...</div>}>
      <div style={{ height: "100%", width: "100%" }}>
        <LiveKitRoom
          token={id}
          serverUrl={import.meta.env.VITE_LIVEKIT_WS_URL}
          connect={true}
        />
      </div>
    </Suspense>
  );
}
