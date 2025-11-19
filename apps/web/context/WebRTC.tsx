"use client";

import React, { use, useCallback, useEffect, useMemo, useState } from "react";

interface WebRTCContextType {
  peer: RTCPeerConnection;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  sendStream: (stream: MediaStream) => Promise<void>;
  remotestream: MediaStream | null;
  callStatus: string;
    setCallStatus: React.Dispatch<React.SetStateAction<string>>;
}

const WebRTCContext = React.createContext<WebRTCContextType | null>(null);

export const useWebRTC = () => {
  const ctx = React.useContext(WebRTCContext);
  if (!ctx) {
    throw new Error("useWebRTC must be used inside <WebRTCProvider>");
  }
  return ctx;
};

export const WebRTCProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [remotestream, setRemoteStream] = React.useState<MediaStream | null>(null);
    const [callStatus, setCallStatus] = useState("calling");
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const sendStream = async (stream: MediaStream) => {
    const tracks = stream.getTracks();
    console.log("sendStram done");
    
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  }
    const HandleTrackEvent = (event: RTCTrackEvent) => {
        console.log('Received remote track:', event.streams[0]);
        const remoteStream = event.streams;
        if (remoteStream[0]) {
          setRemoteStream(remoteStream[0]);
        }
    };

    // const HandleNegotiation = useCallback( async () => {
    //     try {
    //         console.log("negotiations needed");
            
    //         const offer = await peer.createOffer();
    //         await peer.setLocalDescription(offer);
    //         // Here you would typically send the offer to the remote peer via signaling server
    //         console.log("Negotiation needed, created offer:", offer);
    //     } catch (error) {
    //         console.error("Error during negotiationneeded event:", error);
    //     }
    // }, [peer]);

  useEffect(() => {
    peer.addEventListener('track',HandleTrackEvent);
    peer.onconnectionstatechange = () => {
        if(peer.connectionState === "connected") {
            setCallStatus("connected");
        }
        if(peer.connectionState === "disconnected" || peer.connectionState === "failed" || peer.connectionState === "closed") {
            setCallStatus("ended");
        }

    }

    
    // peer.addEventListener('negotiationneeded',HandleNegotiation )
    return () => {
        peer.removeEventListener('track',HandleTrackEvent);
        // peer.removeEventListener('negotiationneeded',HandleNegotiation );
    }
    }, [peer]);



  return (
    <WebRTCContext.Provider value={{ peer, createOffer, createAnswer,sendStream,remotestream,callStatus,setCallStatus }}>
      {children}
    </WebRTCContext.Provider>
  );
};
