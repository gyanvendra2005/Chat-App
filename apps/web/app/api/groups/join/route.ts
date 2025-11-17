import dbconnect from "@/lib/dbconnect";
import User from "../../../../../../packages/models/User";
import Group from "../../../../../../packages/models/Group";

export async function POST(request: Request) {
  await dbconnect();
  try {
    const { groupId, userId } = await request.json();
    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    if (user.group.includes(groupId)) {
        console.log("member htu");
        
      return new Response("Already a member of the group", { status: 400 });
    }
    user.group.push(groupId);
    await user.save();
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $push: { members: userId } },
      { new: true }
    );
    return new Response(JSON.stringify(group), { status: 200 });
  } catch (error) {
    console.error("Error joining group:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
