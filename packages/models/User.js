"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    // passwordHash: { type: String, required: true },
    group: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Group", required: false }],
    image: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
