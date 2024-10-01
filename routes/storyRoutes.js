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
  shareStory,
  getStoriesByID,
} = require("../controllers/storyController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, addStory);
router.put("/edit/:id", auth, editStory);
router.post("/like/:storyId/:slideId", auth, likeSlide);
router.get("/bookmarks", auth, getBookmarkedStories);
router.post("/bookmark/:id", auth, bookmarkStory);
router.get("/:id/share", shareStory);
router.get("/download/:id/:slideId", downloadStory);
router.get("/category/:category", getStoriesByCategory);
router.get("/mystories", auth, getUserStories);
router.get("/:id", getStoriesByID); 

module.exports = router;
