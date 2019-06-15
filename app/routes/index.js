const express = require('express');
const session = require('express-session');
const router = express.Router();
const helper = require('../helpers/helper');
const sendEmail = require('../models/email');
const ejsLint = require('ejs-lint');

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
    res.render('index', { title: 'Trang Chủ', data: req.session.username, dataAdmin: req.session.userAdmin, email: req.session.email});

});

// ============= đăng nhập
router.get("/login", function(req, res){
    if(req.session.user){
        return res.render('index', { title: 'Trang Chủ', data: req.session.user.name });
    }
     res.render("login", { data: "", error: "" } );
})

// ============= post đăng nhập
router.post("/login", function(req, res){

    var params = req.body;
    
    if(params.email.trim().length == 0){

        res.render("login", { error: "Bạn chưa nhập email", data:""  });
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

                    res.render("login", { error: "Bạn nhập sai password", data: "" });

                } else {

                    // đẩy thông tin user vào trong session
                    req.session.user = user;                    
                    req.session.userAdmin = user.userAdmin;
                    req.session.email = user.email;
                    console.log(user);
                    console.log( "Session " + req.session.user.name);
                    // đăng nhập thành công
                    return res.render("index", { title: 'Trang Chủ', data: req.session.user.name, dataAdmin: req.session.userAdmin, email: req.session.email } );
                }
            }).catch(function(err) { 

                res.render("login", { error: "Email của bạn sai!!", data: "" });

            })
        }

    }
})


router.get("/exit", function(req, res){
    if(!req.session.user){
        return res.render("index", { title: 'Trang Chủ', data: "" });
    }
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})

// ============= EDIT USER
router.get("/edit", function(req, res){
    if(!req.session.user){
        return res.render('index', { title: 'Trang Chủ', data: "" });
    } else {
        DB.pool.query('SELECT * FROM public."user" WHERE id = $1', [req.session.user.id], (err, dulieus) => {
            res.render("edit", {data: req.session.user.name, dulieu: dulieus.rows[0]})
            
        })
    }
})

// ============= UPDATE Info USER
router.post("/edit", function(req, res){
    if(!req.session.user){
        return res.render('index', { title: 'Trang Chủ', data: "" });
    } else {
        var name = req.body.name;
        var email = req.body.email;
        var sdt = req.body.sdt;
  
        
        DB.pool.query('UPDATE public."user" SET name = $1, sdt = $2, email = $3 WHERE id = $4', [name, sdt, email, req.session.user.id], (err, res) => {
            
        });

        const getEmail = DB.getUserByEmail(email);

        if(getEmail){

            getEmail.then(function(data){

                var user = data.rows[0];
                req.session.user = user;

                console.log(user);
                console.log( "Session " + req.session.user.name);

            })
        }
        //req.session.user.name = res.rows[0].name;
        
        res.render('index', { title: 'Trang Chủ', data: req.session.user.name });
    }
})


// //load film lên trang chủ
router.get("/",async function(req, res, movie){
    DB.pool.query('SELECT * FROM public."phim"', (err, movies) => {
            res.render("index", { movie: movies.rows[0]})         
    })
})
    // const movies=await Movies.findAll({

    //     //console.log(res.rows);

    //     attributres: ['id','name','publish_date','poster_image', 'duration']
    // })
    // res.render('index',{movies:movies})



module.exports = router;