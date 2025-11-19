// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import { useWebRTC } from "@/context/WebRTC";
// import { Button } from "@/components/ui/button";


// export default function VideoCallPage({ params }: { params: { roomId: string } }) {
//   const { roomId } = params;
//   const [mystream, setMystream] = useState<MediaStream | null>(null);
//   const { sendStream,remotestream } = useWebRTC();
// //   const {setMyStream} = useSocket();
//   const getUserMediaStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });
//       setMystream(stream);
//       console.log("Obtained media stream:", stream);
//     } catch (error) {
//       console.error("Error accessing media devices.", error);
//     }
//   }, []);

//   useEffect(() => {
//     getUserMediaStream();
//   }, [getUserMediaStream]);

//     const send = async () => {
//         if (mystream) {
//         sendStream(mystream);
//         console.log("Sent stream to peer:", mystream);
//         }
//     };
//     useEffect(() => {
//     console.log("Remote stream updated:", remotestream);
//     sendStream(mystream!);
//     }, [remotestream]);


//   return (
//     <div>
//       <h1>Video Call Room: {roomId}</h1>
//    <Button onClick={send} >Turn camera</Button>
// <div className="flex felx-row justify-around gap-5">
//           {/* Render video stream */}
//       <video
//         ref={(video) => {
//           if (video && mystream) {
//             video.srcObject = mystream;
//           }
//         }}
//         autoPlay
//         playsInline
//         muted
//         className="w-[400px] rounded-lg bg-black"
//       />
//        {/* Render video stream */}
//       <video
//         ref={(video) => {
//           if (video && remotestream) {
//             video.srcObject = remotestream;
//           }
//         }}
//         autoPlay
//         playsInline
//         muted
//         className="w-[400px] rounded-lg bg-black"
//       />
// </div>
//     </div>
//   );
// }

"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useWebRTC } from "@/context/WebRTC";
import { Button } from "@/components/ui/button";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import { PhoneCall } from "lucide-react";
import { useSocket } from "../../../../context/SocketProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VideoCallPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const [mystream, setMystream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { sendStream, remotestream,callStatus } = useWebRTC();
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const {handleHangup} = useSocket();
  const router = useRouter();

  // Get user media with constraints
  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setMystream(stream);
console.log("Obtained media stream:", stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert("Camera/microphone access denied");
    }
  }, []);

  // Setup streams on mount
  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  // Update remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remotestream) {
      remoteVideoRef.current.srcObject = remotestream;
    }
  }, [remotestream]);

  // Control toggles
  const handleToggleVideo = () => {
    if (mystream) {
      mystream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const handleToggleAudio = () => {
    if (mystream) {
      mystream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  // Send stream to peer
// Auto-send stream to peer once local media is ready
useEffect(() => {
  if (mystream) {
    console.log("Auto-sending local stream...");
    sendStream(mystream);
  }
}, [mystream,callStatus]);
const handleup = async () => {
    console.log("hangup clicked");
    await handleHangup(roomId, mystream);
    router.push('/chat');
    toast.success("Call ended");
}


  return(
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-6 px-4">
  <h1 className="text-2xl font-bold mb-4 text-white">
    Video Call Room: <span className="text-blue-400">{roomId}</span>
  </h1>

  {/* 🔵 CALL STATUS UI */}
  {callStatus === "calling" && (
    <div className="text-yellow-300 text-lg mb-4">
      📞 Calling… waiting for other user to join
    </div>
  )}

  {callStatus === "ended" && (
    <div className="text-red-400 text-lg mb-4">
      ❌ Call Ended
    </div>
  )}

  {/* 🔵 Local + Remote Videos */}
  <div className="flex flex-wrap justify-center gap-8 mb-6 w-full max-w-4xl">
    {/* You */}
    <div className="flex flex-col items-center">
      <span className="mb-2 text-white font-semibold">You</span>
      <video
        ref={myVideoRef}
        autoPlay
        playsInline
        muted
        poster="/user-avatar.png"
        className="w-[320px] h-[240px] rounded bg-black shadow-lg border border-gray-700"
      />
    </div>

    {/* Remote - always mounted */}
    <div className="flex flex-col items-center">
      <span className={`mb-2 text-white font-semibold ${!remotestream ? "opacity-0" : "opacity-100"}`}>Remote</span>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        poster="/partner-avatar.png"
        className={`w-[320px] h-[240px] rounded bg-black shadow-lg border border-gray-700
          ${!remotestream ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  </div>

  {/* 🔵 Controls - always visible */}
  <div className="flex flex-row justify-center gap-4 mb-4">

    <Button
      onClick={handleToggleVideo}
      className={`${videoEnabled ? "bg-blue-600" : "bg-gray-700"} 
      text-white rounded-full p-3 text-xl`}
    >
      {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
    </Button>

    <Button
      onClick={handleToggleAudio}
      className={`${audioEnabled ? "bg-blue-600" : "bg-gray-700"} 
      text-white rounded-full p-3 text-xl`}
    >
      {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
    </Button>

    <Button
      className="bg-red-600 text-white rounded-full p-3 text-xl"
    //   onClick={() => handleHangup?.(roomId, myVideoRef)}
    onClick={handleup}
    >
      <FaPhoneSlash />
    </Button>
  </div>
</div>
);

}
// "use client";
// import React, { useCallback, useEffect, useState, useRef } from "react";
// import { useWebRTC } from "@/context/WebRTC";
// import { Button } from "@/components/ui/button";

// export default function VideoCallPage({ params }: { params: { roomId: string } }) {
//   const { roomId } = params;
//   const [mystream, setMystream] = useState<MediaStream | null>(null);
//   const { sendStream, remotestream } = useWebRTC();

//   // Refs for video elements (improves performance/responsiveness)
//   const myVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

//   const getUserMediaStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });
//       setMystream(stream);
//       // Video ref update here improves user experience
//       if (myVideoRef.current) {
//         myVideoRef.current.srcObject = stream;
//       }
//       console.log("Obtained media stream:", stream);
//     } catch (error) {
//       console.error("Error accessing media devices.", error);
//     }
//   }, []);

//   useEffect(() => {
//     getUserMediaStream();
//   }, [getUserMediaStream]);

//   const send = async () => {
//     if (mystream) {
//       sendStream(mystream);
//       console.log("Sent stream to peer:", mystream);
//     }
//   };

//   useEffect(() => {
//     console.log("Remote stream updated:", remotestream);
//     sendStream(mystream!);
//     // Set remote video stream for instant UI feedback
//     if (remoteVideoRef.current && remotestream) {
//       remoteVideoRef.current.srcObject = remotestream;
//     }
//   }, [remotestream, mystream, sendStream]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 py-8 px-4">
//       <h1 className="text-3xl font-semibold mb-6 text-white tracking-tight">
//         Video Call Room: <span className="text-blue-400">{roomId}</span>
//       </h1>
//       <div className="flex flex-col md:flex-row items-center gap-8 mb-6 w-full max-w-4xl">
//         {/* Local video */}
//         <div className="flex flex-col items-center">
//           <span className="mb-2 text-white font-light tracking-wide">You</span>
//           <video
//             ref={myVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-80 h-60 rounded-md bg-black shadow-2xl border-[1.5px] border-gray-800"
//           />
//         </div>
//         {/* Remote video */}
//         <div className="flex flex-col items-center">
//           <span className="mb-2 text-white font-light tracking-wide">Remote</span>
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-80 h-60 rounded-md bg-black shadow-2xl border-[1.5px] border-gray-800"
//           />
//         </div>
//       </div>
//       <div className="flex flex-row justify-center gap-6 mt-2">
//         <Button
//           onClick={send}
//           className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow-lg transition"
//         >
//           Turn camera
//         </Button>
//       </div>
//     </div>
//   );
// }
