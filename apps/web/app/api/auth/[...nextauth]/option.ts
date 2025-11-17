import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../../../packages/models/User";
import dbconnect from "@/lib/dbconnect";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // 1️⃣ Create or update user in MongoDB
    async signIn({ user }) {
      await dbconnect();

      const { email, name, image } = user;
      if (!email) return false;

      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        existingUser = await User.create({
          email,
          name,
          image,
        });
      } else {
        await User.updateOne(
          { email },
          { name, image }
        );
      }

      user.id = existingUser._id.toString();
    //   return true;
        console.log("logged");
        
        return true;
    },

    // 2️⃣ Attach values to JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    // 3️⃣ Build session object
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.picture,
      };
      return session;
    },
  },
};
