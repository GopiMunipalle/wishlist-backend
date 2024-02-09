import mongoose, { Types } from "mongoose";

type wishlist = {
  name: string;
  description: string;
  sequenceId: number;
  movies: { name: string; _id: string }[];
};

const wishlistSchema = new mongoose.Schema<wishlist>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sequenceId: {
    type: Number,
  },
  movies: {
    type: [{ type: Types.ObjectId, ref: "Movies" }],
    required: false,
  },
});

const Wishlist = mongoose.model<wishlist>("Wishlist", wishlistSchema);

export default Wishlist;
