require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const passport     = require('passport');
const cors         = require('cors');

require('./configs/passport');

// IF YOU STILL DIDN'T, GO TO 'configs/passport.js' AND UN-COMMENT OUT THE WHOLE FILE

mongoose
  .connect(process.env.MONGO_LAB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// ADD SESSION SETTINGS HERE:
app.use(session({
  secret: process.env.SESSION,
  resave: true,
  saveUninitialized: true
}));

// USE passport.initialize() and passport.session() HERE:
app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:

// app.options('*', cors())
// app.use(
//   cors()
// );
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ROUTES MIDDLEWARE STARTS HERE:

const index = require('./routes/index');
app.use('/', index);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api', projectRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);


module.exports = app;
