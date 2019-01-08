const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('this is working');
})

//the 2nd param is a function that will run right after the listen operation 
//for port 3000 takes place.
app.listen(3000, () => {
    console.log('app is running on port 3000');
});