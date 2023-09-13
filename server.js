const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds  = 10;
const bodyParser = require('body-parser');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'yeseniamarquina',
      password : '',
      database : 'smart-brain'
    }
  });


const app = express();

app.use(bodyParser.json())
app.use(cors())


app.listen(3000, () => {
    console.log('listening on port 3000');
});


// / --> root route
app.get('/', (req, res) => {
    res.send('success');
});

// /signin

app.post('/signin', (req, res) => {
    db.select('*')
    .from('login')
    .where('login.email', req.body.email)
    .then(user => {
    bcrypt.compare(req.body.password, user[0].hash, (err, result) => {
        if(result){
           return db.select('*')
           .from('users')
           .where('users.email', req.body.email)
           .then(user => {
            res.json(user[0]);
           })
           .catch(err => res.status(400).json('unable to get user'))
        }else{
            res.status(400).json('Password or Email is invaild. Try Again.');
        }
      })
    })
    .catch(err => res.status(400).json('wrong credentials'));
})


// /register
app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })

    .then(trx.commit)
    .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to Register'))
})

// /profile/:userID

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    db.select('*')
    .from('users')
    .where('users.id', id)
    .then(response => {
        if(response.length){
            return res.json(response[0]);
        }
        else{
            res.status(400).json("User does not exist");
        }
    })
})

app.put('/image', (req, res) => {

    const {id} = req.body;

    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(e => res.status(400).json(e))

})
