/*
 * Pour ajouter des changements : git add .
 * Pour commiter les changements : git commit -m "message"
 * Pour pousser les commit :
 *         git push [remote name] local_branch:remote_branch
 * Pour pousser sur github (de dev à dev) : git push GitHub dev:dev
 * Pour pousser sur heroku (de dev à master) : git push dev-heroku dev:master
 */

var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , pass = require('./models/pass')
  , passport = require('passport')
  , node_routes = require('./routes/routes')
  , user_routes = require('./routes/user')
  , mariage_routes = require('./routes/mariage.js')
  , port = process.env.PORT || 8080
  , RedisStore = require('connect-redis')(express)
  , redis = require('redis')
  , path = require('path')
  , url = require('url');

//Database connect
var uristring = 'mongodb://' + process.env.UserNameMongoHQ + ':' + process.env.PassWordMongoHQ + '@paulo.mongohq.com:10038/MariageListe';
var mongoOptions = { db: { safe: true }};
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to MongoHQ');
  }
});

// configure Express
app.configure(function () {
    this.set('views', path.join(__dirname + '/views'));
    this.set('view engine', 'jade');
    this.use(express.logger('dev'));
    this.use(express.cookieParser());
    this.use(express.bodyParser());
    this.use(express.methodOverride());
});

// configure redis
app.configure('development', function () {
    this.use(express.session({    secret: 'pas touche'  }));
});

app.configure('production', function () {
    var redisUrl = url.parse(process.env.REDISTOGO_URL);
    var redisAuth = redisUrl.auth.split(':');
    this.use(express.session({
        secret: process.env.REDIS_PWD,
        store: new RedisStore({
            host: redisUrl.hostname,
            port: redisUrl.port,
            db: redisAuth[0],
            pass: redisAuth[1]
        })
    }));
});

// configure passport
app.configure(function() {
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
	this.use(passport.initialize());
	this.use(passport.session());
	this.use(this.router);
	this.use(express.static(__dirname + '/public'));
	this.use(function(req,res){
	    res.status(404).send('This requested page does not exist... yet');
	});
});


/********************** 
 *     Basic pages    *
 *********************/
app.get('/', node_routes.index);
app.get('/forbidden', node_routes.forbidden);
app.get('/home', pass.ensureAuthenticated, node_routes.home);

/**********************
 *   Login/out pages  *
 *********************/
app.get('/logout', user_routes.logout);
app.get('/auth/facebook', user_routes.facebookLogin);
app.get('/auth/facebook/callback', user_routes.facebookCallback);
app.get('/auth/google', user_routes.googleLogin);
app.get('/auth/google/return', user_routes.googleReturn);

/****************
 *   API REST   *
 ***************/
app.get('/api/listeMariage', pass.ensureAuthenticated, mariage_routes.all);
app.post('/api/listeMariage', pass.ensureAuthenticated, mariage_routes.create);
app.del('/api/listeMariage/:Id', pass.ensureAuthenticated, mariage_routes.remove);
app.post('/api/listeMariage/:Id', pass.ensureAuthenticated, mariage_routes.update);


app.listen(port, function() {
  console.log('Express server listening on port: ' + port);
});
