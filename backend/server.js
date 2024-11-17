const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware

// Load environment variables
dotenv.config();

// Check for MongoDB URI in environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("Error: MongoDB URI is missing in environment variables.");
    process.exit(1); // Exit process if URI is missing
}

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Configure CORS dynamically
const allowedOrigins = [
    'http://localhost:63343', // Add local development origin
    'https://hope-git-main-babimishra002-gmailcoms-projects.vercel.app' // Add deployed frontend URL
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow request
        } else {
            callback(new Error('CORS not allowed for this origin.'));
        }
    },
    credentials: true, // Allow credentials if needed
}));

// Log MongoDB URI for debugging (remove in production)
console.log('MongoDB URI:', uri);

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1); // Exit process if connection fails
    });

// Define a Story schema and model
const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    badTimes: { type: String, required: true },
    overcoming: { type: String, required: true },
});
const Story = mongoose.model('Story', storySchema);

// Routes
// Add a new story
app.post('/api/stories', async (req, res) => {
    const { title, badTimes, overcoming } = req.body;

    try {
        const newStory = new Story({ title, badTimes, overcoming });
        await newStory.save();
        res.status(201).json({ message: 'Story added successfully.', story: newStory });
    } catch (err) {
        console.error('Error saving story:', err.message);
        res.status(500).json({ message: 'Failed to save the story.', error: err.message });
    }
});

// Fetch all stories
app.get('/api/stories', async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json(stories);
    } catch (err) {
        console.error('Error fetching stories:', err.message);
        res.status(500).json({ message: 'Failed to fetch stories.', error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
