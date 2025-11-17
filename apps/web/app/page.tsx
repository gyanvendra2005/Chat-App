// "use client"

// import React, { use } from "react"
// import { useSocket } from "../context/SocketProvider";

// export default function Home() {

//   const {sendMessage,messagefromsever} = useSocket();
//   const [message, setMessage] = React.useState("");

//   return (
//      <div>
//         <h1>Welcome to the Home Page</h1>
//           <div>
//             <p>All messages.</p>
//             {
//               messagefromsever.map((msg, index)=>(
//                 <p key={index}>{msg}</p>
//               ))
//             }
//           </div>
//           <div>
//             <input onChange={(e)=>{setMessage(e.target.value)}} type="text" placeholder="Type your message here..." />
//             <button onClick={(e)=>{sendMessage(message)}}>Send Message</button>
//           </div>
//      </div>
//   )
// }

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const {data: session} = useSession();


  if(session){ 
    router.push("/chat");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-6">

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }} 
        className="text-center max-w-2xl"
      >

        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <MessageCircle className="w-20 h-20 text-blue-600" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Connect. Chat. Enjoy.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
          OnWayChat helps you talk with people in real-time.  
          Fast, modern, and built for everyone.
        </p>

        {/* Buttons */}
        <motion.div 
          whileHover={{ scale: 1.04 }} 
          whileTap={{ scale: 0.94 }} 
          className="flex justify-center"
        >
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/auth/signin")}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
