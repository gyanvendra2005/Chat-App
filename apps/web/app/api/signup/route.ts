import dbconnect from "@/lib/dbconnect";
import User from "../../../../../packages/models/User";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const body = await request.json();
        console.log(body);
        const findUser = await User.findOne(
            {
              $or: [{ email: body.email }, { username: body.username }],
            }
        )
        if(!findUser){
            const newUser = new User({
                username: body.username,
                email: body.email,
                password: body.password,
            });
            await newUser.save();
        }
        

    } catch (error) {
        
    }
}