import Counter from "../models/Counter";

export const updateCounter = async () => {
  try {
    const counterDoc = await Counter.findOne({ name: "counter" });
    const sequenceId = counterDoc?.wishlist ? counterDoc.wishlist + 1 : 1;
    console.log(sequenceId);
    console.log(counterDoc);
    if (counterDoc) {
      await counterDoc.updateOne({ wishlist: sequenceId });
    } else {
      const newCounter = new Counter({ name: "counter", wishlist: sequenceId });
      await newCounter.save();
    }

    return sequenceId;
  } catch (error) {
    console.error("Error incrementing counter:", error);
    throw error;
  }
};

export default updateCounter;
