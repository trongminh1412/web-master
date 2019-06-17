  const express = require('express');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const nodemailer=require('nodemailer');

// Create app
const app = express();
const port = process.env.PORT || 3000;

// ! view engine setup
app.set("views", __dirname + "/app/views");
app.set("view engine", "ejs");

// ! cấu hình bodyParser cho form
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// ! cấu hình session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: "secretkey",
	resave: false,
	saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // có thể save được dữ liệu khác vào
}))

//! cấu hình static folder public
app.use("/public", express.static(__dirname + "/public"));

// ! cấu hình để gọi cho router
const routes = require(__dirname + '/app/routes');
app.use(routes);

app.listen( port, function(){
	console.log("server is running on port " + port);
})