require('dotenv').config();
var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Camp = require('../models/camp.js');
var passport = require('passport');

//Home - landing page
router.get('/', function(req,res){
    res.render('landingpage');
});


// Auth Routes
router.get('/register', function(req, res){
    res.render('register', {page: 'register'});
});

router.post('/register', function(req, res){
    let newUser = ({
        username: req.body.username, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === 'secretcode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'You are now registered as ' + user.username);
            res.redirect('/campgrounds');
        })
    })
});


router.get('/login', function(req, res){
    res.render('login', {page: 'login'});
});

router.post('/login', passport.authenticate('local', {
    successRedirect : '/campgrounds',
    failureRedirect : '/login'
}));

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/campgrounds');
});

//User Profile
router.get('/users/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            req.flash('error', 'User not found');
        } else {
            Camp.find().where('author.id').equals(user._id).exec(function(err, campgrounds){
                if(err){
                    req.flash('error', 'Unable to find campgrounds');
                } else {
                    res.render('users/show', {user: user, campgrounds: campgrounds});                    
                }
            })
        }
    });
})


module.exports = router;