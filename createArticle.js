const mongoose = require('mongoose');
const Article = require('./models/article'); // Assuming your Article model path is correct
const User = require('./models/user');

mongoose.connect('mongodb://localhost/bloggingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

async function createArticles() {
    const user1 = await User.findOne({ username: 'mubarak' });
    const user2 = await User.findOne({ username: 'saminu' });
    const user = await User.findOne({ username: 'hussaina' });
    const user2 = await User.findOne({ username: 'iliyasu' });
    const user2 = await User.findOne({ username: 'fatima' });

    const article1 = new Article({
        title: 'First Blog Post',
        description: 'This is the first post.',
        body: 'This is the body of the first post.',
        tags: ['intro', 'beginner'],
        author: user1._id,
        status: 'published'
    });

    const article2 = new Article({
        title: 'Second Blog Post',
        description: 'This is the second post.',
        body: 'This is the body of the second post.',
        tags: ['advanced', 'tutorial'],
        author: user2._id,
        status: 'published'
    });
    
    const article3 = new Article({
      title: 'Third Blog Post',
      description: 'This is the third post.',
      body: 'This is the body of the third post.',
      tags: ['advanced', 'tutorial'],
      author: user3._id,
      status: 'published'
    });

const article4 = new Article({
  title: 'Fourth Blog Post',
  description: 'This is the fourth post.',
  body: 'This is the body of the fourth post.',
  tags: ['advanced', 'tutorial'],
  author: user4._id,
  status: 'published'
});

const article5 = new Article({
  title: 'Fifth Blog Post',
  description: 'This is the fifth post.',
  body: 'This is the body of the fifth post.',
  tags: ['advanced', 'tutorial'],
  author: user5._id,
  status: 'published'
});

    try {
        await article1.save();
        await article2.save();
        await article3.save();
        await article4.save();
        await article5.save();
        console.log("Articles created");
    } catch (error) {
        console.error('Error creating articles:', error);
    }
}

createArticles().then(() => mongoose.disconnect());
