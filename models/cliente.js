const mongoose = require('mongoose')

const Schema = mongoose.Schema




const Cliente = new Schema({
	nome:{
		type : String                     
	},
	cpf:{
		type : String  
	},
	endereco:{
		type : String  
	},
	celular:{
		type : Number  
	},
	vendedor:{
		type : String  
	},
	email:{
		type : String   
	},

	status_financeiro:{
		type : String    	
	},

	status_suporte:{
		type : String 
	}
	
})

mongoose.model("clientes",Cliente)