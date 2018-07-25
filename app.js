var express                 = require('express'),
    mongoose                = require('mongoose'),
    bodyParser              = require('body-parser'),
    Comment                 = require('./models/comment'),
    Camp                    = require('./models/camp'),
    User                    = require('./models/user'),
    seedDB                  = require('./seeds'),
    passport                = require('passport'),
    localStrategy           = require('passport-local'),
    methodOverride          = require('method-override'),
    flash            = require('connect-flash'),
    app                     = express();
    
///////////////////////////// Router //////////////////////////////////////////
var commentRoutes           = require('./routes/comments.js'),
    campgroundRoutes        = require('./routes/campgrounds.js'),
    indexRoutes              = require('./routes/index.js');

//app configs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/images'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');



//////////////////////////// Database //////////////////////////
//connect to database
mongoose.connect('mongodb://localhost/yelp_camp');

//seedDB();

///////////////////////////// Passport Config //////////////////////////////////
app.use(require('express-session') ({
    secret: 'Taking a ride with my best friend',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(indexRoutes);


////////////////////////// Listeners //////////////////////////////
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server is running');
})