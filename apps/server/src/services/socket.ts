// import {Server}  from 'socket.io';
// import Redis from 'ioredis';


// const pub  = new Redis({
//     host:'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
//     port:20329,
//     username:"default",
//     password:'AVNS_tGCL4rvw1Oy9C08pRqX'
// });
// const sub  = new Redis({
//     host:'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
//     port:20329,
//     username:"default",
//     password:'AVNS_tGCL4rvw1Oy9C08pRqX'
// });
// const subscribedChannels = new Set();

// class SocketService{
//     private _io: Server;

//     constructor(){
//        console.log("socket server");
       
//        this._io = new Server({
//          cors: {
//             origin: "*",
//             allowedHeaders: ['*']
//          },
//        });
//     //    sub.subscribe('messages');
//     }

//     public initListeners(){
//         const io = this._io;
//         console.log("initlistener");
//         io.on('connection', (socket) => {
//             console.log('a user connected:', socket.id);
   
//             // JOIN A GROUP
//             socket.on("join-group", async({groupId}:{groupId:string})=>{
//                 socket.join(groupId);
//                 console.log(`User ${socket.id} joined group ${groupId}`);
//                 const channelName = `group:${groupId}`;
//                 if(!subscribedChannels.has(channelName)){
//                     await sub.subscribe(channelName);
//                     subscribedChannels.add(channelName);
//                 }
//             })


//             // SEND MESSAGE
//             socket.on('event:message', async({message,groupId,senderId}) => {
//                 console.log('new message:', message,groupId,senderId);
//                 // Publish the message to Redis
//                 const channel = `group:${groupId}`;
//                 await pub.publish(channel, JSON.stringify({ message, groupId, senderId }));
//             });

//         });


//         // Listen for messages from Redis and broadcast to clients
//         sub.on('message', (channel, message) => {
//                 const parsedMessage = JSON.parse(message);
// const groupId = channel.split(":")[1];

//     console.log(`Broadcasting ONLY to group ${groupId}`);
//                 io.to(groupId).emit('message', parsedMessage);
//         });
//     }

//     get io(){
//         return this._io;
//     }
// }

// export default  SocketService;


// socketService.ts
// import { Server } from "socket.io";
// import Redis from "ioredis";

// // Redis clients
// const pub = new Redis({
//     host: 'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
//     port: 20329,
//     username: "default",
//     password: 'AVNS_tGCL4rvw1Oy9C08pRqX'
// });

// const sub = new Redis({
//     host: 'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
//     port: 20329,
//     username: "default",
//     password: 'AVNS_tGCL4rvw1Oy9C08pRqX'
// });

// // Track subscribed Redis channels
// const subscribedChannels = new Set<string>();

// // Track user's current group
// const userCurrentGroup = new Map<string, string>(); 
// // key = socket.id, value = groupId

// class SocketService {
//     private _io: Server;

//     constructor() {
//         this._io = new Server({
//             cors: { origin: "*", allowedHeaders: ["*"] }
//         });
//         console.log("Socket server initialized");
//     }

//     public initListeners() {
//         const io = this._io;

//         io.on("connection", (socket) => {
//             console.log("User connected:", socket.id);

//             // -------- JOIN GROUP --------
//             socket.on("join-group", async ({ groupId }) => {
//                 const channel = `group:${groupId}`;

//                 // 1️⃣ Leave the previous group
//                 const prevGroup = userCurrentGroup.get(socket.id);
//                 if (prevGroup && prevGroup !== groupId) {
//                     socket.leave(prevGroup);
//                     console.log(`User ${socket.id} left group ${prevGroup}`);
//                 }

//                 // 2️⃣ Join new group
//                 socket.join(groupId);
//                 userCurrentGroup.set(socket.id, groupId);
//                 console.log(`User ${socket.id} joined group ${groupId}`);

//                 // 3️⃣ Subscribe Redis only once per group
//                 if (!subscribedChannels.has(channel)) {
//                     await sub.subscribe(channel);
//                     subscribedChannels.add(channel);
//                     console.log("Subscribed to Redis channel:", channel);
//                 }
//             });

//             // -------- LEAVE GROUP --------
//             socket.on("leave-group", ({ groupId }) => {
//                 socket.leave(groupId);
//                 userCurrentGroup.delete(socket.id);
//                 console.log(`User ${socket.id} left group ${groupId}`);
//             });

//             // -------- SEND MESSAGE --------
//             socket.on("event:message", async ({ message, groupId, senderId }) => {
//                 console.log(`Incoming message for group ${groupId}:`, message);

//                 // Publish message to Redis
//                 await pub.publish(
//                     `group:${groupId}`,
//                     JSON.stringify({ message, groupId, senderId, time: Date.now() })
//                 );
//             });

//             // -------- ON DISCONNECT --------
//             socket.on("disconnect", () => {
//                 const prevGroup = userCurrentGroup.get(socket.id);
//                 if (prevGroup) {
//                     console.log(`User ${socket.id} disconnected and left ${prevGroup}`);
//                     userCurrentGroup.delete(socket.id);
//                 }
//             });
//         });

//         // -------- REDIS MESSAGE HANDLER --------
//         sub.on("message", (channel, rawMsg) => {
//             const data = JSON.parse(rawMsg);
//             const groupId = channel.split(":")[1];

//             console.log(`Broadcasting message to group ${groupId}`);

//             // Emit only to the group room
//             io.to(groupId).emit("group-message", data);
//         });
//     }

//     get io() {
//         return this._io;
//     }
// }

// export default SocketService;


// prev

import { Server } from "socket.io";
import Redis from "ioredis";

// Redis clients
const pub = new Redis({
    host: 'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
    port: 20329,
    username: "default",
    password: 'AVNS_tGCL4rvw1Oy9C08pRqX'
});

const sub = new Redis({
    host: 'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
    port: 20329,
    username: "default",
    password: 'AVNS_tGCL4rvw1Oy9C08pRqX'
});

// --- CONFIG ---
const MESSAGE_TTL = 60 * 30; // 30 minutes
const MAX_MESSAGES = 100;

// Track subscribed Redis channels
const subscribedChannels = new Set<string>();

// Track user's current group
const userCurrentGroup = new Map<string, string>();

const redisKey = (groupId: string) => `group:${groupId}:messages`;
const redisChannel = (groupId: string) => `group:${groupId}`;
const emailToSocketMap = new Map<string, string>();
const socketToEmailMap = new Map<string, string>();
// const onlineUsers = new Map();



class SocketService {
    private _io: Server;

    constructor() {
        this._io = new Server({
            cors: { origin: "*", allowedHeaders: ["*"] }
        });
        console.log("Socket server initialized");
    }

    public initListeners() {
        const io = this._io;

  
        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);
            

            // -------- JOIN GROUP --------
            socket.on("join-group", async ({ groupId }) => {
                const channel = redisChannel(groupId);

                // Leave previous
                const prevGroup = userCurrentGroup.get(socket.id);
                if (prevGroup && prevGroup !== groupId) {
                    socket.leave(prevGroup);
                    console.log(`User ${socket.id} left ${prevGroup}`);
                }

                // Join new group
                socket.join(groupId);
                userCurrentGroup.set(socket.id, groupId);
                console.log(`User ${socket.id} joined ${groupId}`);
                const count = io.sockets.adapter.rooms.get(groupId)?.size || 0;
                io.to(groupId).emit("group-user-count", count);

                // Subscribe to Redis channel only once
                if (!subscribedChannels.has(channel)) {
                    await sub.subscribe(channel);
                    subscribedChannels.add(channel);
                    console.log("Subscribed to Redis:", channel);
                }
            });

            // -------- LEAVE GROUP --------
            socket.on("leave-group", ({ groupId }) => {
                socket.leave(groupId);
                userCurrentGroup.delete(socket.id);
                console.log(`User ${socket.id} left ${groupId}`);
                const count = io.sockets.adapter.rooms.get(groupId)?.size || 0;
                io.to(groupId).emit("group-user-count", count);
            });

            // -------- SEND MESSAGE --------
            socket.on("event:message", async ({ message, groupId, senderId,senderName }) => {
                console.log(`message for group ${groupId}:`, message, senderId, senderName);
                
                const payload = {
                    message,
                    groupId,
                    senderId,
                    senderName,
                    time: Date.now()
                };
                console.log(payload);
                

                const key = redisKey(groupId);

                // Cache message in Redis (LPUSH newest first)
                await pub.lpush(key, JSON.stringify(payload));
                await pub.ltrim(key, 0, MAX_MESSAGES - 1);

                // Reset TTL = 30 mins
                await pub.expire(key, MESSAGE_TTL);

                // Publish for real-time delivery
                await pub.publish(redisChannel(groupId), JSON.stringify(payload));
            });

            // -------- ON DISCONNECT --------
            socket.on("disconnect", () => {
                const prevGroup = userCurrentGroup.get(socket.id);
                // const groupId = userCurrentGroup.get(socket.id);
                if (prevGroup) {
                    console.log(`User ${socket.id} disconnected from ${prevGroup}`);
                    const count = io.sockets.adapter.rooms.get(prevGroup)?.size || 0;
                    io.to(prevGroup).emit("group-user-count", count);
                    userCurrentGroup.delete(socket.id);
                }
            });
        });

        // -------- REDIS PUB/SUB HANDLER --------
        sub.on("message", (channel, rawMsg) => {
            const data = JSON.parse(rawMsg);
            const activeData = {...data, activeUsers: io.engine.clientsCount};
            const groupId = channel.split(":")[1];
            // console.log("Active users",io.engine.clientsCount);
            const activeUsers = io.engine.clientsCount;
            console.log( "active bhaii",activeUsers);
             const count = io.sockets.adapter.rooms.get(groupId)?.size || 0;
            // io.to(groupId).emit("group-user-count", count);
            io.to(groupId).emit("group-message", activeData);
        });


        // video call signaling
        io.on("connection", (socket) => {
            socket.on("join-room", (data) => {
                const { roomId,emailId} = data;
                console.log("Joining room:", roomId, emailId);
                emailToSocketMap.set(emailId, socket.id);
                socketToEmailMap.set(socket.id, emailId);
                socket.join(roomId);
                socket.emit("joined-room", { roomId });
                socket.broadcast.to(roomId).emit("user-joined", { roomId, emailId });
            });

            socket.on("call-user", (data) => {
                const { emailId,offer} = data;
                console.log("calluser from:", socket.id, "to:", emailId);
                const from = socketToEmailMap.get(socket.id);
                const socketId = emailToSocketMap.get(emailId);
                socket.to(socketId!).emit("incoming-call", { offer,from });
            }
        );
            socket.on("answer-call", (data) => {
                const { emailId, answer } = data;
                console.log("answer-call from:", socket.id, "to:", emailId);
                const socketId = emailToSocketMap.get(emailId);
                socket.to(socketId!).emit("call-accepted", { answer });
            });
            // Handle disconnection
            socket.on("hangup", ({ roomId }) => {
  console.log("User hung up in room:", roomId);

  socket.to(roomId).emit("peer-hangup");
});
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
