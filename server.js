const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

//initialise knex library to connect to the Postgres database
const postgresDB = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Ch3lseafc',
      database : 'imagerecognition'
    }
  });

//body-parser library module is a middleware, therefore we need to use 'use' 
//function before we can use it
app.use(bodyParser.json());
//you need the cors module in order to resolve the 
//No 'Access-Control-Allow-Origin' error, which Google chrome
//deploys as a security measure, when it sees that the source
//node (or server), that the client is trying to talk to, is
//not trusted, i.e. in case the source server is a cyber attacker
//trying to get the client to download a malicious software.
app.use(cors());
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
    ],
    login: [
        {
            id: '1',
            name: 'john',
            password: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    bcrypt.compare("hareth", '$2a$10$5U5PPEoBeGs8u.PYlpubyOMP5Yp2loEMcVdBwTWknpsF7YdoRGrvS', function(err, res) {
        //yes == true
        console.log('first guess = ', res)
    })
    bcrypt.compare("veggies", '$2a$10$5V67SRsxgQQRcn.7VlGNHOR7r1TFSQib.6lzO2/t9yn7PlX0/V.16', function(err, res) {
        //yes == true
        console.log('second guess = ', res)
    })
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('username or password is invalid');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });

    console.log(email);
    postgresDB('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    })
        .then(user => {
            //when we register a user, there should only be one,
            //so we're simply returning that user as a sign of 
            //successful registeration
            res.json(user[0]);
        })
            .catch(error => res.status(400).json('unable to register'));
})

//GET user details to personalise page. The colon id part means we can enter
//id in the URL in place of the id (as the URL params) to retrieve that 
//user profile from the server
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //rather than writing where({ id: id }) you can just write shorthand
    //where({ id }), because both parameter and value are same (id).
    postgresDB.select('*').from('users').where({id})
        .then(user => {
            console.log(user)
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json(error);
            }
        })
            .catch(error => res.status(400).json('error getting user'));
});

app.put('/image_upload', (req, res) => {
    const { id } = req.body;
    postgresDB('users').where('id', '=', id)
    .increment('imagesuploaded', 1)
    .returning('imagesuploaded')
    .then(imagesuploaded => {
       res.json(imagesuploaded[0]); 
    })
        .catch(error => res.status(400).json('unable to get uploaded images count'));
})

//the 2nd param is a function that will run right after the listen operation 
//for port 3000 takes place.
app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/*
------ API documentation ----------
/ --> res = this is working
/signin --> POST = success/fail //post because we're positing some data (e.g. username and passowrd). And we don't want to send password through the request query. So we send it in a request body over HTTPS, so that it's hidden from man-in-the-middle attacks and it's secure. 

/register --> POST = user //post becasue we're adding the data to a DB. Returns new user object.

/profile/:userId --> GET = user //access user profile with optional param of accessing userID, so that each user has their own home screen.

/image --> PUT = user(specifically rank of images uploaded/  /PUT because we're simply updating how many images have been uploaded. Because we want to work with the ranking - i.e. anytime a user posts a new photo, we want to make sure that their count of how many photos they've submitted goes up - so we have a variable that keeps track of score, and then check against other users to see who has submitted the most photos and give them a rank.
*/