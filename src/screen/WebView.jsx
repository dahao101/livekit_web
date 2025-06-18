import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import LiveKitSkeleton from "../component/skeleton";

const LiveKitRoom = React.lazy(() =>
  import("@livekit/components-react").then((mod) => ({
    default: mod.LiveKitRoom,
  }))
);

export default function LiveKitWebView() {
  const { id } = useParams();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Suspense fallback={<LiveKitSkeleton />}>
        <LiveKitRoom
          token={id}
          serverUrl={import.meta.env.VITE_LIVEKIT_WS_URL}
          connect={true}
        />
      </Suspense>
    </div>
  );
}
