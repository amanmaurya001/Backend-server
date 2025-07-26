import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
class AppDataSource {
  static connect() {
    return mongoose.connect(MONGO_URI);
  }
  static disconnect() {
    return mongoose.disconnect();
  }
}
export default AppDataSource;
