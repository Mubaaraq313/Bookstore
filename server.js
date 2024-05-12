const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articles');  // We'll create this file next.

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');

// Use it globally or configure selectively for certain routes
app.use(cors());

