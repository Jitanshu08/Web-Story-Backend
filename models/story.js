const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    content: String, // Image/Video URL
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the slide
    category: String,
});

const storySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slides: [slideSchema],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who bookmarked the story
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Story', storySchema);