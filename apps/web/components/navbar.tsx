"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const router =  useRouter();

   const handler = () => {
    if (session) {
      signOut();
    } else {
      router.push("/auth/signin");
    }
   }

  return (
    <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center ml-5 space-x-2">
          {/* <MessageCircle className="w-8 h-8 text-blue-600" /> */}
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
            OnWayChat
          </h1>
        </div>

        {/* Auth Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="px-10 py-2 bg-[#7d4af4] hover:bg-[#6021f3] text-lg "
            onClick={handler}
          >
            {session ? "Sign Out" : "Sign In"}
          </Button>
        </motion.div>
      </div>
    </nav>
  );
}

export default Navbar;
