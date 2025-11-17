import dbconnect from "@/lib/dbconnect";
import Group from "../../../../../../packages/models/Group";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  await dbconnect();
  try {
      const res = await Group.find({
        name: { $regex: name, $options: "i" },
      });
        return new Response(JSON.stringify(res), { status: 201 });
  } catch (error) {
    
  }
}