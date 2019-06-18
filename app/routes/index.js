const express = require('express');
const session = require('express-session');
const router = express.Router();
const helper = require('../helpers/helper');
const multer = require('multer');
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
    if(req.session.user){
        return res.render('index', { title: 'Trang Chủ', data: req.session.user.name });
    }
    return res.render('index', { title: 'Trang Chủ', data: "" });
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
                
                // giải mã password
                var status = helper.compare_password(params.password, user.password);

                if(!status) {

                    res.render("login", { error: "Bạn nhập sai password", data: "" });

                } else {

                    // đẩy thông tin user vào trong session
                    req.session.user = user;
                    console.log(user);
                    console.log( "Session " + req.session.user.name);
                    // đăng nhập thành công
                    return res.render("index", { title: 'Trang Chủ', data: req.session.user.name } );
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
        var password = req.body.password;

        // mã hóa password
        const pass = helper.hash_password(password);

        if(password == ''){
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
            
        } else {

            DB.pool.query('UPDATE public."user" SET name = $1, sdt = $2, email = $3, password = $4 WHERE id = $5', [name, sdt, email, pass, req.session.user.id], (err, res) => {
            
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
        }
        
        //req.session.user.name = res.rows[0].name;
        
        res.render('index', { title: 'Trang Chủ', data: req.session.user.name });
    }
})




// ! khai báo đường dẫn lưu trữ
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname );
    }
})
  
  // ! check files up lên
function checkFileUpload (req, file, cb) {
  
    if(!file.originalname.match(/\.(jpg|png|gif|jpeg)$/))
    {
      cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    else
    {
      cb(null, true); // OK
    }
}

const upload = multer({ storage: storage, fileFilter: checkFileUpload })

// ! Uplaod File
router.get("/upload", function(req, res){
    res.render("upload");
})

router.post("/upload", upload.single('poster_image'), function(req, res){
    var name_movie = req.body.name_movie;
    var publish_date = req.body.publish_date;
    var duration = req.body.duration;
    var poster_image = req.file.path;

    DB.pool.query('INSERT INTO public."phim" (name_movie, publish_date, poster_image, duration) VALUES ($1, $2, $3, $4)', 
        [name_movie, publish_date, poster_image, duration], (err, res) => {

    })
    
    res.redirect("/loadimage");
})

// ! Load Image
router.get("/loadimage", function(req, res){

    DB.pool.query('SELECT * FROM public."phim"', (err, dulieu) => {
        res.render("loadimage", { data: dulieu.rows });
        console.log(dulieu.rows);
        
    })

})







module.exports = router;