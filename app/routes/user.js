var express = require('express');
var router = express.Router();
const helper = require('../helpers/helper');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

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

    res.redirect("/login");


    const output= `
    <p>You have a new Contact request</p>
    <h3>Contact Detail</h3>
    <ul>
    <li>Name: ${req.body.username}</li>
    <li>Phone: ${req.body.sdt}</li>
    <li>Password: ${req.body.password}</li>
    </ul>
    <h3>Message</h3>
    <p>Không tiết lộ thông tin tài khoản mật khẩu để tránh rủi ro cho tài khoản của bạn! </p>
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
        to: 'html2019css@gmail.com, minhshinichi98@gmail.com', // list of receivers
        subject: "Chúc mừng bạn tạo tài khoản thành công ✔", // Subject line
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


//===========FORGET PASSWORD
router.get("/forgot", function(req, res){
    res.render("forgot", { data: "" });
})

router.post("/forgot", function(req, res){

    DB.pool.query('SELECT * FROM public."user"', (err, res) => {
         //console.log(res.rows);
     })    

    function randomValueHex(len) {
    return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex') 
    .slice(0, len) 
    }   
    var user = req.body;
    var password =randomValueHex(6);
    if(user.email.trim().length == 0){

        res.render("forgot", { error: "Bạn chưa nhập email", data:""  });
    }
    else{

        // mã hóa password        
        const pass = helper.hash_password(password);
        //update lại db 
        DB.pool.query('UPDATE public."user" SET password = $1 WHERE email = $2', [pass,user.email], (err, res) => {

        });
        const getEmail = DB.getUserByEmail(user.email);

        if(getEmail){

            getEmail.then(function(data){
                const output= `
                <h3>Mật khẩu mặc định của bạn là : </h3>
                <ul>
                <li>New Password: ${password}</li>
                </ul>
                <h3>Message</h3>
                <p> Không tiết lộ thông tin tài khoản mật khẩu để tránh rủi ro cho tài khoản của bạn!
                </p>
                `
                async function main(){
                  let testAccount = await nodemailer.createTestAccount();
                  let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                secure: false, // true for 465, false for other ports
                auth:{
                    user: 'nodej2019s@gmail.com',
                    pass: 'Node@2019',
                }
            });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                from: '"AVENGER  👻" <nodej2019s@gmail.com>', // sender address
                to: 'html2019css@gmail.com, minhshinichi98@gmail.com', // list of receivers
                subject: "Yêu cầu đặt lại mật khẩu ✔", // Subject line
                text: "Hello world?", // plain text body
                html: output // html body
            });

                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                res.render('POST');
            }
            main().catch(err => {
                console.error(err.message);
                process.exit(1);
            }) 
        }).catch(function(err) { 

            res.render("login", { error: "Email của bạn sai!!", data: "" });
        })               
    }
}




res.redirect("/login");



})


module.exports = router;