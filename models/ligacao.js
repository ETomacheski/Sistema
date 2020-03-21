const mongoose = require('mongoose')

const Schema = mongoose.Schema




const Ligacao = new Schema({
	
	numero_entrada:{
		type: Number
	},
	numero_saida:{
		type: Number
	},
	op_entrada:{
		type: String
	},
	op_saida:{
		type: String
	},
	custo:{
		type: Number
	},
	tempo:{
		type: Number
	}

	
})

mongoose.model("ligacoes",Ligacao)