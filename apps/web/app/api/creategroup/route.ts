import dbconnect from "@/lib/dbconnect";
import Group from "../../../../../packages/models/Group";
import User from "../../../../../packages/models/User";

export async function POST(req: Request) {
    await dbconnect();
   try {
    const { name, description, adminId,adminName } = await req.json();

    // Validate input
    if (!name || !adminId) {
      return new Response(JSON.stringify({ error: "Name and Admin ID are required." }), { status: 400 });
    }

    // Create new group
    const newGroup = new Group({
      name,
      description,
      admin: adminId,
      adminName,
      members: [adminId], // Add admin as the first member
    });

    await newGroup.save();

    // Optionally, update the admin user's group reference
await User.findByIdAndUpdate(
  adminId,
  { $push: { group: newGroup._id } },
  { new: true }
);


    return new Response(JSON.stringify({ message: "Group created successfully", groupId: newGroup._id }), { status: 201 });
   } catch (error) {
    console.error("Error creating group:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
   }
}