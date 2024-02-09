import mongoose from "mongoose";

type counter = {
  name: string;
  wishlist: number;
};

const counterSchema = new mongoose.Schema<counter>({
  name: String,
  wishlist: {
    type: Number,
  },
});

const Counter = mongoose.model<counter>("Counter", counterSchema);
export default Counter;
