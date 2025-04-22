import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    videos: [
        {
            type: String,
            ref: "videos",
        },
    ],
    name: {
        type: String,
        required: [true, "Please provide a playlist name"],
    },
    description: {
        type: String,
        default: "",
    },
}, { timestamps: true }); // createdAt Date
// updatedAt Date

// Enforce unique playlist names per user
playlistSchema.index({ owner: 1, name: 1 }, { unique: true });

const Playlist = mongoose.models.playlists || mongoose.model("playlists", playlistSchema);

export default Playlist;