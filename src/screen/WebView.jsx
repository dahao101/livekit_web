import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import { Button, Typography, CircularProgress, Stack } from "@mui/material";
import {
  LiveKitRoom,
  useRoomContext,
  useLocalParticipant,
  useParticipantTracks,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { createLocalAudioTrack, Track } from "livekit-client";
import "@livekit/components-styles";
import call_animation from "../assets/admin_calling.json";

function LocalAudioPublisher() {
  const { localParticipant } = useLocalParticipant();
  const trackRef = useRef(null);
  const publishedRef = useRef(false);

  useEffect(() => {
    if (
      !localParticipant?.room ||
      localParticipant.room.state !== "connected"
    ) {
      return;
    }

    let cancelled = false;

    const startAudio = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const track = await createLocalAudioTrack({ name: "microphone" });

        if (cancelled) {
          track.stop();
          return;
        }

        if (!publishedRef.current) {
          await localParticipant.publishTrack(track, {
            name: "microphone",
            source: Track.Source.Microphone,
          });
          trackRef.current = track;
          publishedRef.current = true;
          console.log("Audio track published!");
        }
      } catch (err) {
        console.error("Audio publish error", err);
      }
    };

    startAudio();

    return () => {
      cancelled = true;
      const track = trackRef.current;
      if (track) {
        if (publishedRef.current) {
          localParticipant.unpublishTrack(track);
        }
        track.stop();
      }
    };
  }, [localParticipant?.room?.state]);

  return null;
}

function RemoteAudioRenderer() {
  const audioTracks = useParticipantTracks({
    source: Track.Source.Microphone,
    updateOnlyOn: ["subscribed"],
  });

  return (
    <>
      {audioTracks.map(({ track }) =>
        track ? (
          <audio
            key={track.sid}
            ref={(ref) => {
              if (ref) track.attach(ref);
            }}
            autoPlay
          />
        ) : null
      )}
    </>
  );
}

function ParticipantTracker({ setParticipantJoined, onEmptyRoom }) {
  const room = useRoomContext();

  useEffect(() => {
    if (!room || !room.localParticipant) return;
    const checkExistingParticipants = () => {
      const participants = room?.participants;
      if (!participants) return;

      const others = Array.from(participants.values());
      console.log("the others is ", others);
      if (others.length > 0) {
        console.log("Caller already in room.", others);
        setParticipantJoined(true);
      }
    };

    const handleConnect = (participant) => {
      if (participant.identity !== room.localParticipant.identity) {
        console.log("Caller connected:", participant.identity);
        setParticipantJoined(true);
      }
    };

    const handleDisconnect = (participant) => {
      setTimeout(() => {
        if (room.participants.size === 0 && room.state === "connected") {
          onEmptyRoom();
        }
      }, 1000);
    };

    room.on("participantConnected", handleConnect);
    room.on("participantDisconnected", handleDisconnect);

    checkExistingParticipants();

    return () => {
      room.off("participantConnected", handleConnect);
      room.off("participantDisconnected", handleDisconnect);
    };
  }, [room, setParticipantJoined, onEmptyRoom]);

  return null;
}

export default function LiveKitWebView() {
  const { id } = useParams();
  const roomRef = useRef(null);
  const [participantJoined, setParticipantJoined] = useState(false);
  const [hasConnected, setHasConnected] = useState(false);
  const [startCall, setStartCall] = useState(false);
  const token = id;
  console.log("the token is ", token);
  const handleEndCall = async () => {
    try {
      setStartCall(false);
      setParticipantJoined(false);
      setHasConnected(false);
      if (roomRef.current) {
        await roomRef.current.disconnect();
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        position: "relative",
      }}
    >
      {token && startCall ? (
        <LiveKitRoom
          token={token}
          serverUrl={import.meta.env.VITE_LIVEKIT_WS_URL}
          data-lk-theme="default"
          connect={true}
          onConnected={(room) => {
            roomRef.current = room;
            setHasConnected(true);
          }}
          onError={(err) => {
            console.error("LiveKit error:", err);
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ParticipantTracker
            setParticipantJoined={setParticipantJoined}
            onEmptyRoom={handleEndCall}
          />
          <RoomAudioRenderer />

          {!participantJoined ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "100vh", width: "100vw" }}
            >
              <Stack direction="column" alignItems="center" mt={20} spacing={5}>
                <CircularProgress color="primary" size={60} thickness={4} />
                <Typography color="white">
                  Waiting for other participant to join...
                </Typography>
              </Stack>
            </div>
          ) : (
            <Stack direction="column" alignItems="center" mt={30}>
              <Typography
                variant="h5"
                sx={{ position: "absolute", color: "white" }}
              >
                Call in Progress
              </Typography>
            </Stack>
          )}

          {hasConnected && (
            <Button
              variant="contained"
              color="error"
              onClick={handleEndCall}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "200px",
              }}
            >
              Hang Up
            </Button>
          )}
        </LiveKitRoom>
      ) : (
        !startCall && (
          <>
            <Stack
              direction="column"
              spacing={6}
              marginBottom={30}
              justifyContent="center"
              paddingTop="15px"
              alignItems="center"
            >
              <Typography color="black">Geoport Admin is Calling</Typography>
              <Lottie
                animationData={call_animation}
                loop={true}
                style={{ width: 150, height: 150 }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => setStartCall(false)}
                variant="contained"
                color="error"
              >
                Decline
              </Button>
              <Button
                onClick={() => setStartCall(true)}
                variant="contained"
                color="success"
              >
                Answer
              </Button>
            </Stack>
          </>
        )
      )}
    </div>
  );
}
