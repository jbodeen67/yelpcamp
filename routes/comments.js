var express = require('express');
var router = express.Router({mergeParams: true});
var Camp = require('../models/camp.js');
var Comment = require('../models/comment.js');
var middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

router.post('/', middleware.isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', "New Comment Added");
                    res.redirect('/campgrounds/'+ req.params.id);
                }
            })
        }
    })
});

/// Edit
router.get('/:comment_id/edit', middleware.isAuthorizedComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground: req.params.id, comment: comment});
        }
    });
});

///Update
router.put('/:comment_id', middleware.isAuthorizedComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'Comment successfully updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//Destroy
router.delete('/:comment_id', middleware.isAuthorizedComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'Comment has been deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})


module.exports = router;