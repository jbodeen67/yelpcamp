var Camp = require('../models/camp.js');
var Comment = require('../models/comment.js');


var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must login first.');
    res.redirect('/login');
};

middlewareObj.isAuthorizedCampground = function(req, res, next){
    if(req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, campground){
            if(err){
                res.redirect('/campgrounds');
            } else {
                if(campground.author.id.equals(req.user.id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error', 'You do not have access.');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You must login first.');
        res.redirect('back');
    }
};

middlewareObj.isAuthorizedComment = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err) {
                res.redirect('back');
            } else {
                if(comment.author.id.equals(req.user.id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error', 'You do not have access.');
                    res.redirect('back');
                }
            }
        })
    }
};

module.exports = middlewareObj;