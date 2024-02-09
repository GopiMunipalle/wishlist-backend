import mongoose, { Types } from "mongoose";

type UserType = {
  email: string;
  password: string;
  watchlist: { name: string; _id: string }[];
};

const userSchema = new mongoose.Schema<UserType>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    watchlist: [{ type: Types.ObjectId, ref: "Wishlist" }],
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model<UserType>("User", userSchema);

export { User };
