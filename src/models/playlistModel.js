import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos",
            unique: true,
        },
    ],
    name: {
        type: String,
        required: [true, "Please provide a playlist name"],
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },
}, { timestamps: true }); // createdAt Date
// updatedAt Date

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;