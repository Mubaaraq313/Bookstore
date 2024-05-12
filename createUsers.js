const mongoose = require('mongoose');
const User = require('./models/user'); // Assuming your User model path is correct

mongoose.connect('mongodb://localhost/bloggingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

async function createUsers() {
    const user1 = new User({ username: 'mubarak', password: '123456', name: 'Mubarak' });
    const user2 = new User({ username: 'saminu', password: '123456', name: 'Saminu' });
    const user3 = new User({ username: 'hussaina', password: '123456', name: 'Hussaina' });
    const user4 = new User({ username: 'iliyasu', password: '123456', name: 'Iliyasu' });
    const user5 = new User({ username: 'fatima', password: '123456', name: 'Fatima' });

    try {
        await user1.save();
        await user2.save();
        await user3.save();
        await user4.save();
        await user5.save();
        console.log("Users created");
    } catch (error) {
        console.error('Error creating users:', error);
    }
}

createUsers().then(() => mongoose.disconnect());
