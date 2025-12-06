"use client";

import { useEffect, useState, useRef } from "react";
import {
  StreamCall,
  useStreamVideoClient,
  SpeakerLayout,
  CallControls,
  StreamTheme,
} from "@stream-io/video-react-sdk";

import { TranscriptPanel } from "@/app/components/transcript";

import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function MeetingRoom({ callId, onLeave, userId }) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  const joinedRef = useRef(false);
  const leavingRef = useRef(false);
  const callType = "default";

  useEffect(() => {
    if (!client) return;
    if (joinedRef.current) return;

    joinedRef.current = true;

    const init = async () => {
      try {
        const myCall = client.call(callType, callId);

        await myCall.getOrCreate({
          data: {
            created_by_id: userId,
            members: [{ user_id: userId, role: "call_member" }],
          },
        });
        await myCall.join();

        await myCall.startClosedCaptions({ language: "en" });

        myCall.on("call.session_ended", () => {
          console.log("Session ended");
          onLeave?.();
        });

        setCall(myCall);
      } catch (err) {
        setError(err.message);
      }
    };

    init();

    return () => {
      if (call && !leavingRef.current) {
        leavingRef.current = true;
        call.stopClosedCaptions().catch(() => {});
        call.leave().catch(() => {});
      }
    };
  }, [client, callId, userId]);

  const handleLeaveClick = async () => {
    if (leavingRef.current) {
      onLeave?.();
      return;
    }

    leavingRef.current = true;

    try {
      if (call) {
        await call.stopClosedCaptions().catch(() => {});
        await call.leave().catch(() => {});
      }
    } catch (err) {
      console.error("Error leaving call:", err);
    } finally {
      onLeave?.();
    }
  };

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Error: {error}</p>
      </div>
    );

  if (!call)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 mx-auto rounded-full" />
          <p className="mt-4 text-lg">Loading meeting…</p>
        </div>
      </div>
    );

  return (
    <StreamTheme>
      <StreamCall call={call}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 py-6 h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 h-full">
              <div className="flex flex-col gap-4">
                <div className="flex-1 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shadow-2xl">
                  <SpeakerLayout />
                </div>

                <div className="flex justify-center pb-4">
                  <div className="bg-gray-800 rounded-full px-8 py-4 border border-gray-700 shadow-xl">
                    <CallControls onLeave={handleLeaveClick} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                <TranscriptPanel />
              </div>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamTheme>
  );
}
