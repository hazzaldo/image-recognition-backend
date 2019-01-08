const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//body-parser library module is a middleware, therefore we need to use 'use' 
//function before we can use it
app.use(bodyParser.json());
const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            imagesUploaded: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'apple',
            imagesUploaded: 0,
            joined: new Date()
        },
    ]
}

app.get('/', (req, res) => {
    res.send('this is working');
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('signed in successfully');
        } else {
            res.status(400).json('username or password is invalid');
        }
})

//the 2nd param is a function that will run right after the listen operation 
//for port 3000 takes place.
app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success/fail //post because we're positing some data (e.g. username and passowrd). And we don't want to send password through the request query. So we send it in a request body over HTTPS, so that it's hidden from man-in-the-middle attacks and it's secure. 

/register --> POST = user //post becasue we're adding the data to a DB. Returns new user object.

/profile/:userId --> GET = user //access user profile with optional param of accessing userID, so that each user has their own home screen.

/image --> PUT = user(specifically rank of images uploaded/  /PUT because we're simply updating how many images have been uploaded. Because we want to work with the ranking - i.e. anytime a user posts a new photo, we want to make sure that their count of how many photos they've submitted goes up - so we have a variable that keeps track of score, and then check against other users to see who has submitted the most photos and give them a rank.
*/