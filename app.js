if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =require("./models/listing.js");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const multer = require('multer');
const bodyParser = require("body-parser");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");
const session = require("express-session");
const mongoStrore = require ("connect-mongo");
const userRoutes = require("./routes/user.js");
const MONGO_URL = process.env.MONGO_URL;
main().then(()=>{
    console.log("connected to db");
})
.catch((err) =>{
    console.log(err);
});

async function main (){
    await mongoose.connect(MONGO_URL);
}
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const store = mongoStrore.create({
  mongoUrl: MONGO_URL,
  crypto:{
    secret:"yourSecretKey"
  },
  touchAfter:24*3600
})

const sessionConfig = {
  store,
  secret: "yourSecretKey", 
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};


app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//routes
app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);

app.use("/", userRoutes);
//reviews
// post route

// middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});
app.listen(8080, ()=>{
    console.log("server start");
});