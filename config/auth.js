const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//model De usuario

require("../models/usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function (passport) { // função que testa os dados para login
	
	passport.use(new localStrategy({usernameField: 'email',passwordField: 'senha'},(email,senha,done)=>{

		Usuario.findOne({email: email}).then((usuario)=>{ // procura o usuario pelo email
			if(!usuario){ //se nao retonar um usúario mnanda uma mensage
				return done(null,false,{message: "Esta conta não exite"})
			}

			bcrypt.compare(senha,usuario.senha,(erro,batem)=>{ // funçãp do bcrypt para compar as duas senhas e ver se batem
				if (batem) {
					return done(null,usuario)
				}else{
					return done(null,false,{message : "Senha incorreta"})
				}
			})
		})




	}))

	// dalvar os dados do usúario na sessão
	passport.serializeUser((usuario,done)=>{
		done(null,usuario.id)
	})


	passport.deserializeUser((id,done)=>{
		Usuario.findById(id,(err,usuario)=>{
			done(err,usuario)
		})
	})
}