import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    groupId: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
