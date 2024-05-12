const express = require('express');
const Article = require('../models/article');
const auth = require('../middleware/auth'); // Assuming you have authentication set up
const router = express.Router();

// Get all published articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find({ status: 'published' });
        res.send(articles);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Get all articles for admin users (including drafts)
router.get('/all', auth, async (req, res) => {
    // Assuming you check if user is an admin
    if (!req.user.isAdmin) {
        return res.status(403).send('Access denied.');
    }
    try {
        const articles = await Article.find();
        res.send(articles);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Get all published articles accessible by everyone
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find({ status: 'published' }).sort({ publishedDate: -1 }); // Sorted by published date
        res.send(articles);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Example of route protected by authentication middleware
router.post('/', auth, async (req, res) => {
    try {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
            tags: req.body.tags,
            status: req.body.status // client specifies status, defaults to draft if not specified
        });
        await article.save();
        res.send(article);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Get a single article by ID
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).send('Article not found.');
        if (article.status === 'draft' && !req.user.isAdmin) {
            return res.status(403).send('Access denied.');
        }
        res.send(article);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Create a new article
router.post('/', auth, async (req, res) => {
    try {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
            tags: req.body.tags,
            status: req.body.status // Assuming the client specifies the status
        });
        await article.save();
        res.send(article);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

// Update an article's status to 'published'
router.patch('/publish/:id', auth, async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
        if (!article) return res.status(404).send('Article not found.');
        res.send(article);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOne({ _id: req.params.id, author: req.user._id });
        if (!article) {
            return res.status(404).send('Article not found or you do not have permission to edit it.');
        }

        // Update fields if provided
        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;
        article.status = req.body.status || article.status;
        article.tags = req.body.tags || article.tags;

        await article.save();
        res.send(article);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});


// Update an article
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).send('Article not found.');
        }

        if (updates.status && ['draft', 'published'].includes(updates.status)) {
            article.status = updates.status;
        }

        article.title = updates.title || article.title;
        article.content = updates.content || article.content;
        article.tags = updates.tags || article.tags;

        await article.save();
        res.send(article);
    } catch (err) {
        res.status(400).send(err);
    }
});


// Delete an article
router.delete('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOneAndDelete({ _id: req.params.id, author: req.user._id });
        if (!article) {
            return res.status(404).send('Article not found or you do not have permission to delete it.');
        }
        res.send(article);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});


router.patch('/publish/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOne({ _id: req.params.id, author: req.user._id });
        if (!article) {
            return res.status(404).send('Article not found or you do not have permission to publish it.');
        }
        
        article.status = 'published';
        await article.save();
        res.send(article);
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});


// Example of protected route
router.post('/', auth, async (req, res) => {
    const article = new Article({
        ...req.body,
        author: req.user._id
    });

    try {
        await article.save();
        res.status(201).send(article);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Endpoint to get articles by the logged-in user, with optional filtering
router.get('/myarticles', auth, async (req, res) => {
    const match = {};

    // Check if status is being passed as a query parameter
    if (req.query.status) {
        match.status = req.query.status;
    }

    try {
        // Find articles by the user and possibly filtered by status
        const articles = await Article.find({ author: req.user._id, ...match });
        res.send(articles);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Assuming this is in routes/articles.js
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).send('Article not found.');

        if (article.status === 'published') {
            article.readCount += 1; // Increment read count
            await article.save();
        }

        res.send(article);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

// Get paginated, searchable, and sortable list of articles
router.get('/', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 20;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'publishedDate';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    let query = {
        status: 'published',
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
        ]
    };

    if (req.query.author) {
        query.author = mongoose.Types.ObjectId(req.query.author);
    }

    try {
        const articles = await Article.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('author', 'name'); // Assuming 'name' is a field in the User model

        const total = await Article.countDocuments(query);

        res.send({
            articles,
            total,
            page,
            pages: Math.ceil(total / pageSize)
        });
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});
 

module.exports = router;
