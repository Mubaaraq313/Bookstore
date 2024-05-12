const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    tags: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    readCount: { type: Number, default: 0 },
    readingTime: { type: String, default: '1 min' } // Default set as an example
});

articleSchema.methods.calculateReadingTime = function() {
    // Average reading speed is about 250 words per minute
    const words = this.body.split(' ').length;
    const minutes = Math.ceil(words / 250);
    this.readingTime = `${minutes} min read`;
};

articleSchema.pre('save', function(next) {
    this.calculateReadingTime(); // Recalculate reading time before saving
    this.lastUpdated = new Date(); // Update the last updated time
    next();
});

module.exports = mongoose.model('Article', articleSchema);
