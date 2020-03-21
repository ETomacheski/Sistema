const mongoose = require('mongoose')

const Schema = mongoose.Schema




const Usuario = new Schema({
	nome:{
		type : String
	},
	cpf:{
		type: String
	},
	email:{
		type: String
	},
	endereco:{
		type: String
	},
	celular:{
		type: Number
	},
	
	setor:{
		type: String
	},
	senha:{
		type: String
	}
	
})


mongoose.model("usuarios",Usuario)