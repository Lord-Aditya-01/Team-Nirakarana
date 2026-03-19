const mongoose = require("mongoose");
//mongodb+srv://nirakarana01_db_user:ZXufJjPJzJFh3loE@nirakarana.thj9qdh.mongodb.net/?appName=Nirakarana
//mongodb+srv://nirakarana01_db_user:Samved@Nirakarana#01#@nirakarana.thj9qdh.mongodb.net/?appName=Nirakarana
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};

module.exports = connectDB;
