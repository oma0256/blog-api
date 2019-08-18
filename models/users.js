const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    status: { type: String, default: "I am a new user" },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", required: true }]
  },
  { timestamp: true }
);

module.exports = model("User", userSchema);
