const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JavaScript, images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file for the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the JSON data file
app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
});

// Endpoint to handle adding new models
app.post('/add-model', (req, res) => {
    const newModel = req.body;

    // Read the existing data.json
    const dataPath = path.join(__dirname, 'data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read data file.' });
        }

        let models;
        try {
            models = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Failed to parse data file.' });
        }

        // Add new model
        models.push(newModel);

        // Write the updated data back to data.json
        fs.writeFile(dataPath, JSON.stringify(models, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to write data file.' });
            }

            res.json({ success: true });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
