import mongoose from "mongoose";

const createMessageModel = (messageCollectionName) => {
  const messageSchema = new mongoose.Schema(
    {
      postId: {
        type: String,
        required: true,
        unique: true,
      },
      message: String,
      timestamp: Date,
    },
    {
      collection: messageCollectionName,
    }
  );

  if (mongoose.models[messageCollectionName]) {
    return mongoose.models[messageCollectionName];
  }

  return mongoose.model(messageCollectionName, messageSchema);
};

export default createMessageModel;
