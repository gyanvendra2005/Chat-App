// 'use client'
// import React, { use, useCallback, useEffect } from 'react';
// import {io,Socket} from 'socket.io-client';

// interface SocketProviderProps {
//     children?: React.ReactNode;
// }

// interface SocketContextProps{
//     sendMessage: (message: string,groupId:string,senderId:string) => any;
//     messagefromsever: string[];
//     joinGroup: (groupId: string) => any;
// }

// const SocketContext = React.createContext<SocketContextProps|null>(null);



// export const useSocket = ()=> {
//     const context = React.useContext(SocketContext);
//     if(!context){
//         throw new Error("useSocket must be used within a SocketProvider");
//     }
//     return context;
// }

// export const SocketProvider:React.FC<SocketProviderProps>= ({children})=>{
//     const [messagefromsever, setMessage] = React.useState([""]);
//     const [socket, setSocket] = React.useState<Socket>();   

//     // send message
//     const sendMessage: SocketContextProps['sendMessage'] = useCallback((msg:string,groupId:string,senderId:string)=>{
//         console.log("send msg", msg);
//         if(socket){
//             socket.emit("event:message", {message: msg, groupId, senderId});
//         }
        
//     },[socket]);

//     // receive message
//     const OnMessageRecived =  useCallback((data:any)=>{
//         console.log("message from serbver" ,data);
//         setMessage(prev=>[...prev, data]);
//     },[]);

//     // join group
//       // ---------------- JOIN GROUP ----------------
//   const joinGroup = useCallback((groupId: string) => {
//     if (socket) {
//       console.log("Joining group ->", groupId);
//       socket.emit("join-group", { groupId });
//     }
//   }, [socket]);

//     useEffect(()=>{
//         const _socket = io("http://localhost:8000");
//         _socket.on("message", OnMessageRecived);
//         setSocket(_socket);

//         return ()=>{
//             _socket.disconnect();
//             _socket.off("message", OnMessageRecived);
//             setSocket(undefined);
//         }
//     },[])

//  return (
//     <SocketContext.Provider value={{sendMessage,messagefromsever,joinGroup}}>
//     {children}
//     </SocketContext.Provider>
//  )
// };


'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWebRTC } from './WebRTC';
import { set } from 'mongoose';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextProps {
  sendMessage: (message: string, groupId: string, senderId: string,senderName:string) => any;
  messagefromserver: any[];
  joinGroupWithHistory: (groupId: string) => any;
  activeUsersno?: string[];
  JoinVideoCall: (roomId: string,emailId:string) => any;
  HandleRoomJoined: (data: any) => any;
  setMyStream?: (stream: MediaStream) => void;
  handleHangup: (roomId: string,mystream: MediaStream | null) => any;
  setRemoteStream  ?: (stream: MediaStream | null) => void;
}

const SocketContext = React.createContext<SocketContextProps | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used inside provider");
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [messagefromserver, setMessages] = React.useState<any[]>([]);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [activeUsersno, setActiveUsers] = React.useState<string[]>([]);
  const [ mystream, setMyStream] = React.useState<MediaStream | null>(null);
  const [remoteemail, setRemoteEmail] = React.useState<string | null>(null);
  const router = useRouter();

  const currentGroupRef = useRef<string | null>(null);

  const { peer,createOffer,sendStream,setCallStatus } = useWebRTC();

  // ------------------------------------
  // SEND MESSAGE
  // ------------------------------------
  const sendMessage = useCallback(
    (message: string, groupId: string, senderId: string,senderName:string) => {
      if (!socket) return;
      socket.emit("event:message", { message, groupId, senderId,senderName });
    },
    [socket]
  );

  // ------------------------------------
  // ON MESSAGE RECEIVED
  // ------------------------------------
  const onMessageReceived = useCallback((data: any) => {
    console.log("mesa", data);
       
    setMessages((prev) => [...prev, data]);
  }, []);
  const activeUsers = useCallback((data: any) => {
  console.log("Active Users:", data);
  setActiveUsers(data);
}, []);


  // ------------------------------------
  // JOIN GROUP + LOAD HISTORY FIRST
  // ------------------------------------
  const joinGroupWithHistory = useCallback(
    async (groupId: string) => {
      if (!socket) return;

      // 1) Leave previous group
      const previous = currentGroupRef.current;
      if (previous && previous !== groupId) {
        socket.emit("leave-group", { groupId: previous });
      }

      // 2) Load cached messages from redis/api
      const res = await fetch(`/api/messages/${groupId}`);
      const json = await res.json();

      setMessages(json.messages || []);

      // 3) Join new room AFTER loading history
      socket.emit("join-group", { groupId });

      currentGroupRef.current = groupId;
    },
    [socket]
  );

    // join vedio call room
  // socket?.emit("join-room", { roomId: "some-room-id",emailId:"gyani@" });
  const JoinVideoCall = useCallback(
    (roomId: string,emailId:string) => {
      if (!socket) return;

      socket.emit("join-room", { roomId,emailId });
    },
    [socket]
  );

  //  room joined handler
  const HandleRoomJoined = useCallback((data: { roomId: string }) => {
    console.log("Joined room:", data.roomId);
    router.push(`/videocall/${data.roomId}`);
  }, [router]);



  // other user joined handler
//  const HandleOtherUserRoomJoined = useCallback(async (data: { roomId: string; emailId: string }) => {
//   console.log("User-joined event:", data.emailId);

//   if (!socket) {
//     console.log("Socket not ready yet");
//     return;
//   }
//   const offer = await createOffer();
//   console.log("Offer generated:", offer);
//   setRemoteEmail(data.emailId);
//   socket.emit("call-user", { emailId: data.emailId, offer });
// }, [socket]);

const HandleOtherUserRoomJoined = useCallback(async (data:any) => {
  console.log("User-joined event:", data.emailId);

  if (!socket) {
    console.log("Socket not ready yet");
    return;
  }

  setRemoteEmail(data.emailId);    // FIXED — set first

  const offer = await createOffer();  // then create offer

  socket.emit("call-user", {
    emailId: data.emailId,
    offer,
  });

}, [socket, createOffer]);



  // incoming call handler
  // const HandleIncomingCall = useCallback( async(data: { from: string, offer: RTCSessionDescriptionInit }) => {
  //   console.log(`Incoming call from ${data.from}`);
  //   await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
  //   const answer = await peer.createAnswer();
  //   await peer.setLocalDescription(answer);
  //   // Send answer back to caller
  //   setRemoteEmail(data.from);
  //   socket?.emit("answer-call", { emailId: data.from, answer });
  // }, [socket, peer]);

  
const HandleIncomingCall = useCallback(async (data:any) => {
  console.log(`Incoming call from ${data.from}`);

  setRemoteEmail(data.from);   // FIXED — set BEFORE answering

  await peer.setRemoteDescription(new RTCSessionDescription(data.offer));

  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  socket?.emit("answer-call", {
    emailId: data.from,
    answer
  });

}, [peer, socket]);


// call answered handler
   const HandleCallAnswered = useCallback( async(data: { answer: RTCSessionDescriptionInit }) => {
    console.log("Call answered");
    await peer.setRemoteDescription(new RTCSessionDescription(data.answer));

   },[peer]);



  //  negotiation needed handler
    const HandleNegotiation = useCallback(async () => {
  if (!remoteemail || !socket) {
    console.warn("Negotiation skipped: missing remoteemail or socket");
    return;
  }

  console.log("NEGOTIATION NEEDED → creating new offer");

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);

  socket.emit("call-user", {
    emailId: remoteemail,
    offer,
  });

  console.log("Sent renegotiation offer to:", remoteemail);
}, [peer, socket, remoteemail]);


// hangup logic
// const handleHangup = (roomId:string,l) => {
//   console.log("Hanging up…");

//   // 1. Notify all peers
//   socket?.emit("hangup", { roomId });

//   // 2. Close all RTCPeerConnections
//   Object.values(peer.current).forEach((peer: any) => {
//     peer.ontrack = null;
//     peer.onicecandidate = null;
//     peer.onnegotiationneeded = null;
//     peer.close();
//   });
//   peer.current = {};

//   // 3. Stop local media tracks
//   if (localStreamRef.current) {
//     localStreamRef.current.getTracks().forEach((track:any) => track.stop());
//     localStreamRef.current = null;
//   }

//   // 4. Clear UI streams
//   // setRemoteStreams({});
//   setMyStream(null);

//   console.log("Call ended and resources cleaned.");
// };


// const handleHangup = (roomId: string, mystream: MediaStream | null) => {
//   console.log("Hanging up…");

//   // 1. Inform room
//   socket?.emit("hangup", { roomId });

//   // 2. Close RTCPeerConnection
//   try {
//     peer.ontrack = null;
//     peer.onicecandidate = null;
//     peer.onnegotiationneeded = null;

//     peer.getSenders().forEach(sender => sender.replaceTrack(null));
//     peer.getReceivers().forEach(receiver => receiver.track?.stop());

//     peer.close();
//   } catch (e) {
//     console.warn("Peer close error:", e);
//   }

//   // 3. Stop local camera/mic
//   if (mystream) {
//     mystream.getTracks().forEach(track => track.stop());
//   }

//   // 4. Clear remote stream in WebRTC context
//   // setRemoteStream(null);

//   console.log("Call fully ended.");
// };

const handleHangup = useCallback(async (roomId: string, mystream: MediaStream | null) => {
  
  console.log("Hanging up…");

  // 1. Inform room
  socket?.emit("hangup", { roomId });

  // 2. Close RTCPeerConnection
  try {
    peer.ontrack = null;
    peer.onicecandidate = null;
    peer.onnegotiationneeded = null;

    peer.getSenders().forEach(sender => sender.replaceTrack(null));
    peer.getReceivers().forEach(receiver => receiver.track?.stop());

    peer.close();
  } catch (e) {
    console.warn("Peer close error:", e);
  }

  // 3. Stop local camera/mic
  if (mystream) {
    mystream.getTracks().forEach(track => track.stop());
  }

  // 4. Clear remote stream in WebRTC context
  // setRemoteStream(null);

  console.log("Call fully ended.");
}, [peer, socket, remoteemail]);

const HandlePeerHangup = useCallback(() => {
  console.log("Peer hung up. Closing call.");

  // 1. Close RTCPeerConnection
  peer.close();

  // 2. Stop sending tracks
  peer.getSenders().forEach(sender => sender.track?.stop());

  // 3. Clear remote stream in UI
  setCallStatus("ended");
  setMyStream(null);

  // 4. Optional: update WebRTC context state if needed
  // setCallStatus("ended");
}, [peer]);


  

  useEffect(() => {
  if (!socket) return;

  socket.on("group-message", onMessageReceived);
  socket.on("group-user-count", activeUsers); 
  socket.on("joined-room", HandleRoomJoined);
  socket.on("user-joined", HandleOtherUserRoomJoined);
  socket.on("incoming-call", HandleIncomingCall);
  socket.on("call-accepted", HandleCallAnswered) ;
  peer.addEventListener('negotiationneeded',HandleNegotiation );
  socket.on("peer-hangup", HandlePeerHangup);
  

  return () => {
    socket.off("group-message", onMessageReceived);
    socket.off("group-user-count", activeUsers); 
    socket.off("joined-room", HandleRoomJoined);
    socket.off("user-joined", HandleOtherUserRoomJoined);
    socket.off("incoming-call", HandleIncomingCall);
    socket.off("call-accepted", HandleCallAnswered)
    peer.removeEventListener('negotiationneeded',HandleNegotiation );
    socket.off("peer-hangup", HandlePeerHangup);
  };
}, [
  socket,
  onMessageReceived,
  activeUsers,
  HandleRoomJoined,
  HandleOtherUserRoomJoined,
  HandleIncomingCall,
  HandleCallAnswered,
  handleHangup,
  // setRemoteStream  ,
]);
  useEffect(() => {
    const _socket = io("http://localhost:8000");
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      setSocket(null);
    };
  }, []);


  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        messagefromserver,
        joinGroupWithHistory,
        activeUsersno,
        JoinVideoCall,
        HandleRoomJoined,
        setMyStream,
        handleHangup,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
