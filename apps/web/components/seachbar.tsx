import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ImprovedSheetDemo(userId: any) {
  const [groupName, setGroupName] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  let isMember = false;

  const seachGroup = async () => {
    const res = await axios.get("/api/groups/search", {
      params: {
        name: groupName,
      },
    });
    if (res.status === 201) {
      console.log("Search Results:", res.data);
      console.log(res.data[0].members);
      console.log("user", userId.userId);
      res.data[0].members.map((m: any) =>
        console.log("member", m.toString() === userId.userId.toString())
      );

      setSearchResults(res.data);
    }
  };

  const joinGroup = async () => {
    try {
      const res = await axios.post("/api/groups/join", {
        groupId: selectedGroup._id,
        userId: userId.userId,
      });

      if (res.status === 200) {
        alert("Successfully joined the group!");
        toast.success("Successfully joined the group!");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Failed to join the group.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-purple-400 hover:bg-purple-600">Search Group...</Button>
      </SheetTrigger>

      <SheetContent className="w-[380px] bg-white sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>Search Group</SheetTitle>
          <SheetDescription>
            Filter groups based on name and tags.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 m-2">
          {/* Group Name */}
          <div className="grid gap-3">
            <Label htmlFor="group-name">Group Name</Label>
            <div className="flex flex-row">
              <Input
                id="group-name"
                value={groupName}
                placeholder="Enter group name..."
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button className="mt-0 w-fit" onClick={seachGroup}>
                <Search />
              </Button>
            </div>
          </div>

            {/* Search Results */}  
          <ScrollArea className="h-[55vh] bg-[#F1F3F5] rounded-xl p-3">
            {searchResults.map((g, i) => {
              const active = selectedGroup?._id === g._id;

              return (
                <div
                  key={i}
                  onClick={() => setSelectedGroup(g)}
                  className={`p-4 rounded-xl cursor-pointer flex items-center justify-between mb-3 transition border
          ${
            active
              ? "bg-[#EDF2FF] border-blue-300 shadow-sm"
              : "bg-white hover:bg-gray-50 hover:shadow-sm"
          }
        `}
                >
                  {/* LEFT SIDE: Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src={g.avatar || "https://i.pravatar.cc/150?img=3"}
                      className="w-12 h-12 rounded-full object-cover border"
                    />

                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-900">
                        {g.name}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {g.members.length} members
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Button */}
                  <div className="ml-auto">
                    {
                      (isMember = g.members.some(
                        (member: string) =>
                          String(member) === String(userId.userId)
                      ))
                    }

                    {isMember ? (
                      <Button className="text-sm px-4 py-1 bg-green-300">
                        View
                      </Button>
                    ) : (
                      <Button
                        onClick={joinGroup}
                        variant="default"
                        className="text-sm hover:bg-red-700  bg-red-500 px-4 py-1"
                      >
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
