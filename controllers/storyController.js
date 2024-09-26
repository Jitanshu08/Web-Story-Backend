const Story = require('../models/story');

exports.addStory = async (req, res) => {
    const { slides } = req.body;
    
    if (slides.length < 3 || slides.length > 6) {
        return res.status(400).json({ message: 'Stories must have between 3 and 6 slides' });
    }

    // Ensure each slide has content, type, and description
    const validSlides = slides.every(slide => slide.content && slide.type && slide.description);
    if (!validSlides) {
        return res.status(400).json({ message: 'Each slide must have a content URL, type, and description' });
    }

    const lastSlideCategory = slides[slides.length - 1].category;
    const story = await Story.create({
        user: req.user._id,
        slides,
        category: lastSlideCategory,
    });

    res.status(201).json(story);
};

exports.editStory = async (req, res) => {
    const { id } = req.params;
    const { slides } = req.body;

    try {
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        // Check if the logged-in user is the owner of the story
        if (story.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        story.slides = slides; // Update the slides, including the description
        await story.save();
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


exports.likeSlide = async (req, res) => {
    const { storyId, slideId } = req.params;
    
    try {
        const story = await Story.findById(storyId);
        const slide = story.slides.id(slideId);
        
        if (!slide) return res.status(404).json({ message: 'Slide not found' });
        
        const userId = req.user._id;
        const likedIndex = slide.likes.indexOf(userId);

        // If user has already liked, remove like; otherwise, add like
        if (likedIndex !== -1) {
            slide.likes.splice(likedIndex, 1); // Unlike
        } else {
            slide.likes.push(userId); // Like
        }

        await story.save();
        res.status(200).json({ likes: slide.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


exports.bookmarkStory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const story = await Story.findById(id);
        
        if (!story) return res.status(404).json({ message: 'Story not found' });

        const userId = req.user._id;
        const bookmarkedIndex = story.bookmarks.indexOf(userId);

        // If user has already bookmarked, remove bookmark; otherwise, add bookmark
        if (bookmarkedIndex !== -1) {
            story.bookmarks.splice(bookmarkedIndex, 1); // Remove bookmark
        } else {
            story.bookmarks.push(userId); // Add bookmark
        }

        await story.save();
        res.status(200).json({ bookmarks: story.bookmarks.length });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


// exports.getUserStories = async (req, res) => {
//     const stories = await Story.find({ user: req.user._id });
//     res.status(200).json(stories);
// };

exports.getStoriesByCategory = async (req, res) => {
    const { category } = req.params;
    const stories = await Story.find({ category });
    res.status(200).json(stories);
};

exports.downloadStory = async (req, res) => {
    const { id } = req.params;
    try {
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        
        const slideURLs = story.slides.map(slide => slide.content); // Assuming slide.content stores the URL of the image/video
        res.status(200).json({ slides: slideURLs });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


exports.shareStory = async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    
    const shareableLink = `${process.env.FRONTEND_URL}/stories/${story._id}`;
    res.status(200).json({ message: 'Link copied', link: shareableLink });
};

exports.getBookmarkedStories = async (req, res) => {
    try {
        const stories = await Story.find({ bookmarks: req.user._id });
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getUserStories = async (req, res) => {
    try {
        // Fetch stories where the logged-in user's ID matches the user field
        const stories = await Story.find({ user: req.user._id });

        // Check if user has any stories
        if (!stories.length) {
            return res.status(404).json({ message: 'No stories found for this user' });
        }

        // Return the stories
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getStoriesByID = async(req, res) => {
    const { id } = req.params;
    try {
        const story = await Story.findById(id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};