const mongoose = require('mongoose')

const Schema = mongoose.Schema




const Log = new Schema({
	usuario:{
		type : String                     
	},
	informacao:{
		type : String  
	},
	cadastro:{
		type : String  
	}
	
	
})

mongoose.model("logs",Log)