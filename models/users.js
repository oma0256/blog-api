const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", required: true }]
  },
  { timestamp: true }
);

module.exports = model("User", userSchema);
