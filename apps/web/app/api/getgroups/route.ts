import dbconnect from "@/lib/dbconnect";
import User from "../../../../../packages/models/User";
import Group from "../../../../../packages/models/Group";

export async function GET(request: Request) {
    await dbconnect();
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return new Response(
            JSON.stringify({ error: "Missing userId parameter" }),
            { status: 400 }
        );
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        console.log(user);
        
        // Make sure it's user.groups
        const groupIds = user.group || [];

        console.log(groupIds);
        
        // Fetch all groups using Promise.all
        const groups = await Promise.all(
            groupIds.map((id) => Group.findById(id))
        );
        console.log(groups);

        return new Response(
            JSON.stringify({ groups }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching groups:", error);
        return new Response(
            JSON.stringify({ error: "Error fetching groups" }),
            { status: 500 }
        );
    }
}
