if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Application Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const port = process.env.PORT || 3235;
const MongoStore = require('connect-mongo');
// const multer = require("multer");
// const { idCardStorage } = require("./cloudinary/index");
// const idCardUpload = multer({ storage: idCardStorage });

// My Modules
const User = require("./model/user");
const Admin = require("./model/admin");
const Survey = require("./model/survey");
const { notLoggedIn, loggedIn } = require("./middleware");

// Router
const logRegRoute = require("./routes/logRegRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const production = false

// Session Config
const sessionOptions = {
  store: MongoStore.create({
     mongoUrl: 'mongodb://127.0.0.1:27017/barangayDB',
     touchAfter: 24 * 60 * 60,
     secret: 'thisshouldbeabettersecret',

     }),
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  httpOnly: true,
};

// Database Connection
mongoose.set('strictQuery', false)


const connectDB = async()=> {
  try {

    if(process.env.MONGO_URI && production){
      console.log('Have the URI and in Production')
      const conn = await mongoose.connect(process.env.MONGO_URI)
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    else if(process.env.MONGO_URI && !production){
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/barangayDB')
      console.log('Have the URI and not in Production')
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      console.log('http://localhost:3235/')
    }
    
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
// mongoose
//   .connect("mongodb://127.0.0.1:27017/barangayDB")
//   .then((res) => {
//     console.log("~~Success connecting to database~~"); 
//   })
//   .catch((err) => {
//     console.log("Connection Error");
//   });
// Setting Middlewares and Templating
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Authentication For General User and Administrator
passport.use("user", new LocalStrategy(User.authenticate()));
passport.use("admin", new LocalStrategy(Admin.authenticate()));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  if (user != null) {
    done(null, user);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  if (req.path == "/about") {
    res.locals.onAbout = true;
  } else {
    res.locals.onAbout = false;
  }
  next();
});

app.get("/", loggedIn, async (req, res) => {
  res.render("home", { title: "Barangay Mag-Asawang Sapa" });
});
app.get("/about", loggedIn, async (req, res) => {
  res.render("about", { title: "About || Barangay Mag-Asawang Sapa" });
});
app.get("/terms-and-conditions", loggedIn, async (req, res) => {
  res.render("terms", { title: "Terms and Condition || Barangay Mag-Asawang Sapa" });
});
app.get("/privacy-policy", loggedIn, async (req, res) => {
  res.render("privacy", { title: "Privacy Policy || Barangay Mag-Asawang Sapa" });
});

app.use("/", logRegRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.use((err, req, res, next) => {
  console.log("*************************");
  console.log("*************************");
  console.log(err);
  console.log("*************************");
  console.log("*************************");
  res.send(err.message);
});

app.all("*", (req, res) => {
  res.render('notFound')
});


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}/`)
   });
   
})
