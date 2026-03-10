import mongoose from "../lib/mongodb";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone:{
      type: Number,
    },
    suspend:{
      type:Boolean,
      default:false,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
  },
  {
    timestamps: true,
  }
);

let User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;