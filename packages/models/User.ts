import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  // passwordHash: { type: String, required: true },
  group:[{ type: mongoose.Schema.Types.ObjectId, ref: "Group", required: false }],
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;