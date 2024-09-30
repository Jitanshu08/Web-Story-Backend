const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  heading: String, // New field for slide heading
  content: String, // URL for the image/video
  type: String, // Either 'image' or 'video'
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  category: String, // Category of the slide
  description: String, // New field for slide description
});

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  slides: [slideSchema],
  category: String, // Category based on the last slide
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Story", storySchema);
