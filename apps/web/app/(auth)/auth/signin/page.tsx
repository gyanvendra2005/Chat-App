"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";


export default function SignInPage() {
    const { data: session } = useSession();
    console.log(session);
    
    

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Getting Started</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to OnwayChat</DialogTitle>
          <DialogDescription>
            Login to continue using the app.
          </DialogDescription>
        </DialogHeader>

        <Button
          className="mt-4"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
