var express = require('express');
var router = express.Router();
const helper = require('../helpers/helper');
const nodemailer = require('nodemailer');


// require DATABASE
const DB = require('../models/db');

// ============= đăng ký
router.get("/signup", function(req, res){
    res.render("signup", { data: "" });
})

// ============= đăng ký dùng POST
router.post("/signup", function(req, res){

    var user = req.body;

    if(user.username.trim().length == 0){

        res.render("signup", { data: {error: "Bạn chưa nhập họ tên"} });
    }
    if(user.email.trim().length  == 0){

        res.render("signup", { data: {error: "Bạn chưa nhập email"} });
    }
    if(user.sdt.trim().length  == 0){

        res.render("signup", { data: {error: "Bạn chưa nhập số điện thoại"} });
    }
    if(user.password != user.confirmpassword && user.password.trim().length != 0)
    {
        res.render("signup", { data: {error: "Bạn chưa nhập đúng mật khẩu"} });
    }
    
    // mã hóa password
    const password = helper.hash_password(user.password);

    // Thêm Vào DB
    DB.pool.query('INSERT INTO public."user"(name, sdt, email, password) VALUES ($1, $2, $3, $4)', [user.username, user.sdt, user.email, password], (err, res) => {

    })

    res.redirect("/");


    const output= `
    <p>You have a new Contact request</p>
    <h3>Contact Detail</h3>
    <ul>
    <li>Name: ${req.body.username}</li>
    <li>Phone: ${req.body.sdt}</li>
    <li>Password: ${req.body.password}</li>
    </ul>
    <h3>Message</h3>
    <p> ${req.body.Message}</p>
    `;
    async function main(){
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'nodej2019s@gmail.com',
            pass: 'Node@2019',
        }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
        from: '"AVENGER  👻" <nodej2019s@gmail.com>', // sender address
        to: 'html2019css@gmail.com', // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render('POST',{msg: 'eamil has been sent'});
    }
    main().catch(err => {
        console.error(err.message);
        process.exit(1);
    })
})

// ============= EDIT USER
router.get("/edit", function(req, res){
    res.render("edit", { data: "" });
})

// router.get("/edit", function(req, res){
//     pool.connect(function(err, client, done){
//         if(err){
//             return console.error('error',err);
//         }
//         client.query('select * from QuanLy' ['1'],function(err,result){
//             done();
//             if(err){
//                 res.end();
//                 return console.error('error',err);
//             }
//             res.render("login",{data:result});
//         });
//     });
    
// })


module.exports = router;