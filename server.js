const express = require('express');
const cors = require('cors');
// import bodyParser from 'body-parser';
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())
app.use(cors())
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: '123',
            entries: 2,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'Dave',
            email: 'dave@gmail.com',
            entries: 2,
            joined: new Date()
        }
    ]
}



app.listen(3000, () => {
    console.log('listening on port 3000');
});


// / --> root route
app.get('/', (req, res) => {
    res.send(database.users);
});

// /signin

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('Success');
    }else{
        res.status(400).json('access denied')
    }
})


// /register
app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entires: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length -1]);
})

// /profile/:userID

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})

app.post('/image', (req, res) => {

    const {id} = req.body;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            console.log(user.entries);
            user.entries++;
            console.log(user.entries)
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }


})
