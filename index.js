require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/UserDB", { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
 } );

 const userSchema = new mongoose.Schema( {
     firstName: String,
     lastName: String,
     email: String,
     password: String,
     confirmPassword: String,
     birthDate: String,
     field: String,
     city: String
 });

 



 const User = new mongoose.model('User', userSchema);

 app.get('/', function(req, res){
    res.render('home')
});


app.get('/login', function(req, res){
    res.render('login')
});

app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', function(req,res){
    bcrypt.hash(req.body.password, saltRounds,function(err, hash){
        const newUser = new User({
            firstName: req.body.firstName,
             lastName: req.body.lastName,
             email: req.body.email,
             password: hash,
             confirmPassword: hash,
             birthDate: req.body.birthDate,
             field: req.body.field,
             city: req.body.city
            });
            newUser.save(function(err){
                if(err){
                    console.log(err)
                }
                else{
                   res.render('secrets')
                }
        
            });
    });
    
    
});

app.post('/login', function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email}, function(err, foundUser){
        if(err){
            console.log(err)
        }
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password,function(err, result){
                    if(result === true){
                        res.render('secrets');
                    }
                });
        }
    }
});
    
});

app.listen(9999, ()=>{
    console.log('server up at 9999');

})

