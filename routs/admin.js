const express = require ("express")

const router = express.Router()


router.get('/',(req,res)=>{		//rota inicial do site
	res.render("home")
})


module.exports = router