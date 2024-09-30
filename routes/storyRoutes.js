const express = require("express");
const {
  addStory,
  editStory,
  likeSlide,
  bookmarkStory,
  downloadStory,
  getStoriesByCategory,
  getUserStories,
  getBookmarkedStories,
  shareStory, getStoriesByID
} = require("../controllers/storyController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, addStory);
router.put("/edit/:id", auth, editStory);
router.post("/like/:storyId/:slideId", auth, likeSlide);
router.get("/bookmarks", auth, getBookmarkedStories); // Add this route
router.post("/bookmark/:id", auth, bookmarkStory);
router.get("/:id/share", shareStory); // Add this route
router.get("/download/:id", downloadStory); // Define this route
router.get("/category/:category", getStoriesByCategory);
router.get('/mystories', auth, getUserStories); // Protect this route using the auth middleware
router.get("/stories/:id",auth, getStoriesByID);

module.exports = router;
