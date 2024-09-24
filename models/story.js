const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    content: String, // URL for the image/video
    type: String, // Either 'image' or 'video'
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: String,
  });  

const storySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slides: [slideSchema],
    category: String, // Add category field to story based on last slide
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who bookmarked the story
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Story', storySchema);