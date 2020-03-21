const express =require ("express");
const app =  express();
const PORT = 8081;
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash")
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');


// requisição dos conjuntos de rotas
const admin = require("./routs/admin")
const usuario = require("./routs/usuario")


// configuração do passport para realizar o login
const passport = require("passport");
require("./config/auth")(passport) 

//confg 
	//sessão
		app.use(session({
			secret: "sistema",
			resave: true,
			saveUnitialized: true

		}))

		app.use(passport.initialize())
		app.use(passport.session())
		app.use(flash())


	//middleware
		app.use((req,res,next)=>{
			res.locals.success_msg = req.flash("success_msg"),
			res.locals.error_msg = req.flash("error_msg")
			res.locals.error = req.flash("error")
			res.locals.user = req.user || null;
			next();
		})
	//template engine
		app.engine('handlebars', handlebars({extended:false}));
		app.set('view engine','handlebars');
	//body parser
		app.use(bodyParser.urlencoded({defaultlayout: 'main'}))
		app.use(bodyParser.json())
	//public
		app.use(express.static(path.join(__dirname,"public")))
	
	//Mongoose

		mongoose.Promise = global.Promise;
		mongoose.connect("mongodb://localhost/sistema_telefonico",{
			useNewUrlParer:true
		}).then(()=>{
			console.log("Conectado com o mongo")
		})


//rotas
	app.use('/admin',admin)
	app.use('/usuario',usuario)


app.listen(PORT, function () {
	console.log("Servidor Rodando na url htpp:/localhost:"+PORT);
});
