import mongoose from "mongoose";
const chatsCollection = "messages";
const chatsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const chatsModel = mongoose.model(chatsCollection, chatsSchema);
