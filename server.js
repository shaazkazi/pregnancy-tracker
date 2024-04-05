// Require necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Using promises-based file system module
const path = require('path');

// Create an Express app
const app = express();

// Configure middleware (body-parser)
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define route to handle POST request to add new visit data
app.post('/add-visit', async (req, res) => {
    try {
        // Extract new visit data from request body
        const newVisitData = req.body;

        // Read existing data from updates.json asynchronously
        let existingData = await fs.readFile('updates.json', 'utf8');
        existingData = JSON.parse(existingData);

        // Append new visit data to existing data
        existingData.push(newVisitData);

        // Write updated data back to updates.json asynchronously
        await fs.writeFile('updates.json', JSON.stringify(existingData, null, 2));

        res.status(200).send('Visit data added successfully');
    } catch (error) {
        console.error('Error adding visit data:', error);
        res.status(500).send('Internal server error');
    }
});

// Serve updates.json file
app.get('/updates.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'updates.json'));
});

// Define route handler for the root URL ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
