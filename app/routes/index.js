const express = require('express');
const session = require('express-session');
const router = express.Router();
const helper = require('../helpers/helper');
const sendEmail = require('../models/email');

// require DATABASE
const DB = require('../models/db');


// require USER and ADMIN
router.use("/admin", require(__dirname + "/admin"));
router.use("/user", require(__dirname + "/user"));

/* GET home page. */
router.get('/', function(req, res, next) {
    DB.pool.query('SELECT * FROM public."user"', (err, res) => {
        //console.log(res.rows);
        
    })
    res.render('index', { title: 'Trang Chủ', data: "" });
});

// ============= đăng nhập
router.get("/login", function(req, res){
     res.render("login", { data: "" } );
})

// ============= post đăng nhập
router.post("/login", function(req, res){

    var params = req.body;
    
    if(params.email.trim().length == 0){

        res.render("login", { data: { error: "Bạn chưa nhập email" } });
    }
    else{

        const getEmail = DB.getUserByEmail(params.email);

        if(getEmail){

            getEmail.then(function(data){

                var user = data.rows[0];
                // console.log(data.rows[0]);
                
                // giải mã password
                var status = helper.compare_password(params.password, user.password);

                if(!status) {

                    res.render("login", { data: { error: "Bạn nhập sai password" } });

                } else {

                    // đẩy thông tin user vào trong session
                    req.session.user = user;
                    console.log( "Session " + req.session.id);

                    // đăng nhập thành công
                    res.render("index", { title: 'Trang Chủ', data: user.name } );
                }
            }).catch(function(err) { 

                res.render("login", { data: { error: "Email của bạn sai!!" } });

            })
        }

    }
})

module.exports = router;