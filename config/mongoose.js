import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB at ${db.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB");
    process.exit(1);
  }
};

export default connectDatabase;
