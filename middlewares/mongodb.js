import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, options);
    console.log("successfully connected to MongoDB.");
  } catch (err) {
    console.log("unconnected to MongoDB.");
    throw new Error();
  }
};
export default connectDB;
