import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    videos: [
        {
            url: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                default: "",
            },
            thumbnail: {
                type: String, // Cloudinary or YouTube thumbnail URL
                default: null,
            },
            addedAt: {
                type: Date,
                default: Date.now,
            }
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
    thumbnail: {
        type: String,
        default: null, // Will store first video's thumbnail
    },
}, { timestamps: true }); // createdAt Date
// updatedAt Date

// Enforce unique playlist names per user
playlistSchema.index({ owner: 1, name: 1 }, { unique: true });

const Playlist = mongoose.models.playlists || mongoose.model("playlists", playlistSchema);

export default Playlist;