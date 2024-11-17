const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware

// Initialize dotenv to load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("MongoDB URI is missing in the environment variables");
    process.exit(1); // Exit the process if URI is not found
}

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // To parse JSON bodies
app.use(cors({ origin: 'http://localhost:63343' })); // Allow requests from your frontend origin

console.log(process.env.MONGODB_URI); // Log MongoDB URI (for debugging)

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Story schema for MongoDB
const storySchema = new mongoose.Schema({
    title: String,
    badTimes: String,
    overcoming: String,
});

const Story = mongoose.model('Story', storySchema);

// API route to save a new story
app.post('/api/stories', async (req, res) => {
    const { title, badTimes, overcoming } = req.body;

    try {
        const newStory = new Story({ title, badTimes, overcoming });
        await newStory.save();
        res.status(201).json({ message: 'Story added successfully', story: newStory });
    } catch (err) {
        console.error('Error saving story:', err);
        res.status(500).json({ message: 'Error saving story', error: err });
    }
});

// API route to get all stories
app.get('/api/stories', async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json(stories);
    } catch (err) {
        console.error('Error fetching stories:', err);
        res.status(500).json({ message: 'Error fetching stories', error: err });
    }
});

// Start the server on a specified port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
