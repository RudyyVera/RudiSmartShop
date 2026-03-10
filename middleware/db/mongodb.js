import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    return res.status(500).json({
      error: "Database is not configured. Set MONGODB_URI in environment variables.",
    });
  }

  try {
    if (mongoose.connections[0].readyState) {
      // Use current db connection
      return handler(req, res);
    }
    // Use new db connection
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    return handler(req, res);
  } catch (err) {
    console.log("DATABASE CONNECTION FAILED");
    console.log(err.message);

    return res.status(500).json({
      error: "Database connection failed.",
      details: err.message,
    });
  }
};

export default connectDB;
