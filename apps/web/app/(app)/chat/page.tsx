// "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTrigger,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { MoreVertical, Phone, Video, Terminal, Send } from "lucide-react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";

// const messagesData: any = {
//   General: [
//     { sender: "Alex", time: "10:21 AM", text: "Good morning team!" },
//     { sender: "John", time: "10:22 AM", text: "Morning!" },
//   ],
//   Designers: [
//     { sender: "Robert", time: "11:10 AM", text: "Option A looks good." },
//     { sender: "Jenny", time: "11:12 AM", text: "Agreed!" },
//   ],
//   Sports: [
//     { sender: "Coach", time: "8:45 PM", text: "Practice at 6 AM tomorrow." },
//   ],
// };

// export default function ChatUI() {
//   const { data: session } = useSession();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   const [groupsData, setGroupsData] = useState<any[]>([]);
//   const [selectedGroup, setSelectedGroup] = useState<any>(null);

//   const [messages, setMessages] = useState<any[]>([]);

//   // ------------------ CREATE GROUP ------------------
//   const creategroup = async () => {
//     try {
//       const res = await axios.post("/api/creategroup", {
//         name,
//         description,
//         adminId: session?.user?.id,
//       });

//       if (res.status === 201) {
//         toast.success("Group created!");
//       } else toast.error("Error creating group");
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error");
//     }
//   };

//   // ------------------ GET GROUPS ------------------
//   const GetGroup = async () => {
//     try {
//       const res = await axios.get("/api/getgroups", {
//         params: { userId: session?.user?.id },
//       });
//        console.log(res.data.groups);

//       if (res.status === 200) {
//         setGroupsData(res.data.groups);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error fetching groups");
//     }
//   };

//   useEffect(() => {
//     if (session) GetGroup();
//   }, [session]);

//   // Auto-select first group
//   useEffect(() => {
//     if (groupsData.length > 0) {
//       setSelectedGroup(groupsData[0]);
//       setMessages(messagesData[groupsData[0].name] || []);
//     }
//   }, [groupsData]);

//   // When group changes → load its messages
//   useEffect(() => {
//     if (selectedGroup) {
//       setMessages(messagesData[selectedGroup.name] || []);
//     }
//   }, [selectedGroup]);

//   return (
//     <div className="h-screen w-full flex gap-2 p-4 bg-green-100">

//       {/* ---------------- LEFT PANEL ---------------- */}
//       <div className="w-80 bg-white p-6 rounded-xl shadow-md flex flex-col gap-6">

//         <h2 className="text-xl font-semibold">Groups</h2>

//         <Input placeholder="Search groups..." />

//         {/* CREATE GROUP DIALOG */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
//               + Create New Group
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-md rounded-2xl p-4">
//             <DialogHeader>
//               <DialogTitle>Create a New Group</DialogTitle>
//               <DialogDescription>
//                 Give your group a name and description.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4 mt-2">
//               <div>
//                 <label className="text-sm font-medium">Group Name</label>
//                 <Input
//                   placeholder="Enter group name"
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Description</label>
//                 <Textarea
//                   placeholder="Write a short description..."
//                   className="min-h-[90px]"
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//             </div>

//             <Alert variant="destructive" className="mt-4">
//               <Terminal className="h-4 w-4" />
//               <AlertTitle>Warning</AlertTitle>
//               <AlertDescription>
//                 Avoid inappropriate group names.
//               </AlertDescription>
//             </Alert>

//             <Button
//               onClick={creategroup}
//               className="w-full mt-6 bg-indigo-600 text-white"
//             >
//               Create Group
//             </Button>
//           </DialogContent>
//         </Dialog>

//         {/* GROUP LIST */}
//         <ScrollArea className="h-[70vh] pr-2">
//           {groupsData.map((g, i) => {
//             const active = selectedGroup?._id === g._id;

//             return (
//               <div
//                 key={i}
//                 onClick={() => setSelectedGroup(g)}
//                 className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 mb-3
//                   ${active ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100"}
//                 `}
//               >
//                 <img src={g.avatar} className="w-10 h-10 rounded-full" />

//                 <div>
//                   <div className="font-medium">{g.name}</div>
//                   <div className="text-xs text-gray-500">{g.lastMsg}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </ScrollArea>
//       </div>

//       {/* ---------------- RIGHT MAIN CHAT AREA ---------------- */}
//       {selectedGroup ? (
//         <div className="flex-1 flex flex-col rounded-xl bg-white shadow-lg overflow-hidden">

//           {/* HEADER */}
//           <div className="p-5 border-b flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <img
//                 src={selectedGroup.avatar}
//                 className="w-12 h-12 rounded-full"
//               />
//               <div>
//                 <div className="text-lg font-semibold">{selectedGroup.name}</div>
//                 <div className="text-xs text-gray-500">
//                   {selectedGroup.members} members
//                 </div>
//               </div>
//             </div>
//             <MoreVertical className="cursor-pointer" />
//           </div>

//           {/* MESSAGES */}
//           <ScrollArea className="px-8 py-6 mb-10 h-[calc(100vh-220px)]">
//             <div className="flex flex-col">
//               {messages.map((msg: any, idx: number) => (
//                 <motion.div
//                   key={idx}
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-blue-50 p-3 rounded-xl max-w-[70%] mb-3 shadow"
//                 >
//                   <div className="flex justify-between mb-1">
//                     <span className="font-semibold text-blue-700 text-sm">
//                       {msg.sender}
//                     </span>
//                     <span className="text-xs text-gray-400">{msg.time}</span>
//                   </div>

//                   <div className="text-sm text-gray-800">{msg.text}</div>
//                 </motion.div>
//               ))}
//             </div>
//           </ScrollArea>

//           {/* INPUT BOX */}
//           <div className="p-5 flex gap-3 border-t bg-white">
//             <Input
//               placeholder={`Message in ${selectedGroup.name}...`}
//               className="flex-1 rounded-full px-5 py-3"
//             />
//             <Button className="w-11 h-11 rounded-full bg-green-500 hover:bg-green-600">
//               <Send className="text-white" />
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           Select a group to start chatting
//         </div>
//       )}

//          {/* ─────────── RIGHT PANEL — GROUP DETAILS ─────────── */}
//       <div className="w-80 bg-white p-6 rounded-xl shadow-md flex flex-col gap-8">

//         <div className="flex flex-col items-center">
//           {/* <img src={selectedGroup.avatar} className="w-20 h-20 rounded-full" /> */}
//           <h2 className="font-bold text-lg mt-3">{selectedGroup.name}</h2>
//           <p className="text-sm text-gray-500">{selectedGroup.members} members</p>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-center gap-3">
//           <Button variant="outline">
//             <Phone className="h-4 w-4 mr-2" /> Voice
//           </Button>
//           <Button variant="outline">
//             <Video className="h-4 w-4 mr-2" /> Video
//           </Button>
//         </div>

//         {/* Additional Options */}
//         <div className="space-y-4 text-sm">
//           <p className="text-gray-600 cursor-pointer hover:underline">Search Messages</p>
//           <p className="text-gray-600 cursor-pointer hover:underline">Change Color</p>
//           <p className="text-gray-600 cursor-pointer hover:underline">Change Emoji</p>
//           <p className="text-gray-600 cursor-pointer hover:underline">Links</p>
//         </div>

//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "../../../context/SocketProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  MoreVertical,
  Phone,
  Video,
  Terminal,
  Send,
  Dot,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import ImprovedSheetDemo from "@/components/seachbar";

export default function ChatUI() {
  interface SessionUser {
    id?: string;
    name?: string;
    email?: string ;
    image?: string;
  }
  interface Session {
    user?: SessionUser;
  }
  const { data: session } = useSession() as { data: Session };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupsData, setGroupsData] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const {
    sendMessage,
    messagefromserver,
    joinGroupWithHistory,
    activeUsersno,
  } = useSocket();
  const [message, setMessage] = React.useState("");

  const formatPrettyTime = (ms: number) => {
    if (!ms) return "";

    const date = new Date(ms);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    //  Just now
    if (diffMinutes < 1) return "Just now";

    //  Minutes ago
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    //  Hours ago
    if (diffHours < 24) return `${diffHours}h ago`;

    //  Yesterday
    if (diffDays === 1) return "Yesterday";

    // Within last 7 days — show day + time
    if (diffDays < 7) {
      return date.toLocaleString([], {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // 6️⃣ Older — show date (DD Mon YYYY)
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ------------------------ CREATE GROUP ------------------------
  const createGroup = async () => {
    try {
      const res = await axios.post("/api/creategroup", {
        name,
        description,
        adminId: session?.user?.id,
        adminName: session?.user?.name,
      });

      if (res.status === 201) {
        toast.success("Group created!");
        setName("");
        setDescription("");
        GetGroups();
      } else {
        toast.error("Error creating group");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  // ------------------------ GET GROUPS ------------------------
  const GetGroups = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await axios.get("/api/getgroups", {
        params: { userId: session.user.id },
      });
      console.log(res.data.groups);

      if (res.status === 200) {
        setGroupsData(res.data.groups);
      }
    } catch (err) {
      toast.error("Error fetching groups");
    }
  };

  useEffect(() => {
    if (session) GetGroups();
    console.log(groupsData);
  }, [session]);

  // Auto-select first group
  useEffect(() => {
    if (groupsData.length > 0) {
      setSelectedGroup(groupsData[0]);
      setMessages(groupsData[0].messages || []);
    }
  }, [groupsData]);

  // When the user selects a group → join socket room
  useEffect(() => {
    if (selectedGroup?._id) {
      joinGroupWithHistory(selectedGroup._id);
    }
  }, [selectedGroup]);

  return (
    <div className="h-screen w-full flex gap-2 p-4 bg-green-100">
      {/* ---------------- LEFT PANEL ---------------- */}
      <div className="w-80 bg-white p-6 rounded-xl shadow-md flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Groups</h2>

       <ImprovedSheetDemo userId={session?.user?.id} />

        {/* CREATE GROUP DIALOG */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#4C6EF5] text-white hover:bg-[#3B5BDB] rounded-xl py-5 text-[15px] font-semibold shadow-md hover:shadow-lg transition">
              + Create New Group
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md rounded-2xl p-6 shadow-xl border bg-white">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Create New Group
              </DialogTitle>

              <DialogDescription className="text-gray-500 text-sm">
                Fill in the details below to create a new chat group.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Group Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Group Name
                </label>

                <Input
                  value={name}
                  placeholder="Enter group name..."
                  className="h-11 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>

                <Textarea
                  value={description}
                  placeholder="Describe your group..."
                  className="min-h-[110px] border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Warning Box */}
              <Alert className="border border-red-300 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-red-600" />
                  <AlertTitle className="font-semibold text-red-700">
                    Naming Warning
                  </AlertTitle>
                </div>

                <AlertDescription className="text-red-600 text-sm mt-1">
                  Please avoid inappropriate or offensive group names.
                </AlertDescription>
              </Alert>
            </div>

            {/* Create Button */}
            <Button
              onClick={createGroup}
              className="w-full mt-5 bg-indigo-600 text-white rounded-xl py-3 text-[15px] font-semibold hover:bg-indigo-700 hover:shadow-lg transition"
            >
              Create Group
            </Button>
          </DialogContent>
        </Dialog>

        {/* GROUP LIST */}
        <ScrollArea className="h-[55vh]  bg-[#F1F3F5] rounded-xl">
          {groupsData.map((g, i) => {
            const active = selectedGroup?._id === g._id;

            return (
              <div
                key={i}
                onClick={() => setSelectedGroup(g)}
                className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 mb-3 transition
          ${active ? "bg-[#EDF2FF] border border-blue-300" : "hover:bg-gray-100"}
        `}
              >
                <img
                  src={g.avatar || "https://i.pravatar.cc/150?img=3"}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-gray-500">
                    {g.lastMsg || "No messages yet"}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      {/* ---------------- MAIN CHAT AREA ---------------- */}
      {selectedGroup ? (
        <div className="flex-1 flex flex-col rounded-xl bg-white shadow-lg overflow-hidden">
          {/* HEADER */}
          <div className="p-5 border-b bg-[#DEE2E6] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={selectedGroup.avatar || "https://i.pravatar.cc/150?img=3"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-semibold">
                  {selectedGroup.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Dot className="rounded-full bg-green-600 text-green-600 h-2 w-2" />
                  <p>{activeUsersno} Active</p>
                </div>
              </div>
            </div>
            <MoreVertical className="cursor-pointer" />
          </div>

          {/* MESSAGES */}
          <ScrollArea className="px-8 py-6 mb-10 h-[calc(95vh-220px)]">
            <div className="flex flex-col">
              {messagefromserver.map((msg: any, idx: number) => {
                const isYou = msg.senderId === session?.user?.id;
                console.log(messagefromserver);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative p-3 rounded-xl max-w-[70%] mb-3 shadow 
    ${isYou ? "self-end bg-green-200" : "self-start bg-blue-50"}
  `}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-xs">
                        {msg.senderId === session?.user?.id
                          ? "You"
                          : msg.senderName}
                      </span>
                    </div>

                    <div className="text-sm text-gray-800 pr-10">
                      {msg.message}
                    </div>

                    {/* Time bottom-right */}
                    <span className="absolute bottom-1 mt-3 right-2 text-[8px] text-gray-500">
                      {formatPrettyTime(msg.time)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>

          {/* INPUT BOX */}
          <div className="p-5 flex gap-3 border-t bg-white">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message in ${selectedGroup.name}...`}
              className="flex-1 rounded-full px-5 py-3"
            />
            <Button
              onClick={(e) => {
                sendMessage(
                  message,
                  selectedGroup._id,
                  session?.user?.id,
                  session?.user?.name
                );
                setMessage("");
              }}
              className="w-11 h-11 rounded-full bg-green-500 hover:bg-green-600"
            >
              <Send className="text-white" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a group to start chatting
        </div>
      )}

      {/* ---------------- RIGHT SIDE PANEL (ONLY IF GROUP SELECTED) ---------------- */}
      {selectedGroup && (
        <div className="w-80 bg-white p-6 rounded-xl shadow-md flex flex-col gap-8">
          <div className="flex flex-col items-center">
            <img
              src={selectedGroup?.avatar || "https://i.pravatar.cc/150?img=3"}
              className="w-20 h-20 rounded-full object-cover"
            />
            <h2 className="font-bold text-lg mt-3">{selectedGroup?.name}</h2>
            <p className="text-sm text-gray-500">
              {selectedGroup?.members?.length} members
            </p>
            <p className="text-sm text-gray-500 flex flex-row">
              <p className="font-medium text-black">Admin:</p>
              {selectedGroup?.adminName}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast.promise<{ name: string }>(
                  () =>
                    new Promise((resolve) =>
                      setTimeout(() => resolve({ name: "Event" }), 2000)
                    ),
                  {
                    loading: "Loading...",
                    success: (data) => `Service not available yet`,
                    error: "Error",
                  }
                );
              }}
            >
              <Phone className="h-4 w-4 mr-2" /> Voice
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.promise<{ name: string }>(
                  () =>
                    new Promise((resolve) =>
                      setTimeout(() => resolve({ name: "Event" }), 2000)
                    ),
                  {
                    loading: "Loading...",
                    success: (data) => `Service not available yet`,
                    error: "Error",
                  }
                );
              }}
            >
              <Video className="h-4 w-4 mr-2" /> Video
            </Button>
          </div>

          {/* Options */}
          <div className="space-y-4 text-sm">
            <p className="text-gray-600 cursor-pointer hover:underline">
              Search Messages
            </p>
            <p className="text-gray-600 cursor-pointer hover:underline">
              Change Theme
            </p>
            <p className="text-gray-600 cursor-pointer hover:underline">
              Links
            </p>
            <p className="text-gray-600 cursor-pointer hover:underline">
              Files
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
