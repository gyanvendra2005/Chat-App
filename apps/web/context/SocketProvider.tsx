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

import React, { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextProps {
  sendMessage: (message: string, groupId: string, senderId: string,senderName:string) => any;
  messagefromserver: any[];
  joinGroupWithHistory: (groupId: string) => any;
  activeUsersno?: string[];
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

  const currentGroupRef = useRef<string | null>(null);

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
  
  useEffect(() => {
  const _socket = io("http://localhost:8000");

  _socket.on("group-message", onMessageReceived);
  _socket.on("group-user-count", activeUsers); 

  setSocket(_socket);

  return () => {
    _socket.off("group-message", onMessageReceived);
    _socket.off("group-user-count", activeUsers); 
    _socket.disconnect();
  };
}, []);


  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        messagefromserver,
        joinGroupWithHistory,
        activeUsersno,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};


// "use client";

// import React, { useCallback, useEffect } from "react";
// import { io, Socket } from "socket.io-client";

// interface SocketProviderProps {
//   children?: React.ReactNode;
// }

// interface SocketContextProps {
//   sendMessage: (groupId: string, senderId: string, text: string) => void;
//   messages: any[];
//   joinGroup: (groupId: string) => void;
// }

// const SocketContext = React.createContext<SocketContextProps | null>(null);

// export const useSocket = () => {
//   const ctx = React.useContext(SocketContext);
//   if (!ctx) throw new Error("useSocket must be used within SocketProvider");
//   return ctx;
// };

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const [socket, setSocket] = React.useState<Socket>();
//   const [messages, setMessages] = React.useState<any[]>([]);

//   // ---------------- JOIN GROUP ----------------
//   const joinGroup = useCallback(
//     (groupId: string) => {
//       if (socket) {
//         socket.emit("join-group", { groupId });
//       }
//     },
//     [socket]
//   );

//   // ---------------- SEND MESSAGE ----------------
//   const sendMessage = useCallback(
//     (groupId: string, senderId: string, text: string) => {
//       if (!socket) return;
//       socket.emit("event:message", { groupId, senderId, message: text });

//       // show "You" message instantly
//       setMessages((prev) => [
//         ...prev,
//         {
//           senderId,
//           text,
//           senderName: "You",
//           time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         },
//       ]);
//     },
//     [socket]
//   );

//   // ---------------- RECEIVE MESSAGE ----------------
//   const OnMessage = useCallback((data: any) => {
//     setMessages((prev) => [
//       ...prev,
//       {
//         senderId: data.senderId,
//         text: data.message,
//         senderName: data.senderId === "You" ? "You" : "User",
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       },
//     ]);
//   }, []);

//   useEffect(() => {
//     const _socket = io("http://localhost:8000");
//     setSocket(_socket);

//     _socket.on("message", OnMessage);

//     return () => {
//       _socket.disconnect();
//       _socket.off("message", OnMessage);
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ sendMessage, joinGroup, messages }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
