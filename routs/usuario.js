const express = require ("express")
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")


// requisição dos models
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
require("../models/cliente")
const Cliente = mongoose.model("clientes")
require("../models/ligacao")
const Ligacao = mongoose.model("ligacoes")
require("../models/logs")
const Log = mongoose.model("logs")


router.get('/cadastro',(req,res)=>{ // rota para o cadastro inicial para admin
	res.render('cadastro_usuarios')
})



router.post('/add',(req,res)=>{	// rota para adicionar um usuario
	Usuario.findOne({email: req.body.email}).then((usuario)=>{
		if(usuario){
			req.flash("error_msg","Ja existe uma conta com esse email")
			res.redirect("/usuario/cadastro")
		}else{
			const novoUsuario = new Usuario({
				nome: req.body.nome,
				email: req.body.email,
				cpf: req.body.cpf,
				endereco: req.body.endereco,
				celular: req.body.celular,
				setor: req.body.setor,
				senha: req.body.senha
			})

			bcrypt.genSalt(10,(erro,salt)=>{
				bcrypt.hash(novoUsuario.senha,salt,(erro,hash)=>{// configuração do hash da senha, para dar mais segurança para o site
					if(erro){
						req.flash("error_msg","Houve um erro")
						res.redirect("/")
					}

					novoUsuario.senha = hash
					novoUsuario.save().then(()=>{
						req.flash("success_msg","Criado com sucesso")
						req.redirect("/usuario/pagina")
					}).catch((err)=>{
						res.redirect('/admin')
					})
				})

			})

		}
	})
})

router.get("/pagina",(req,res)=>{ //pagina principal do site
	if(!req.isAuthenticated()){//checagem para ver se tem um usúario logado
		res.redirect('/admin')
	}
	
	Log.find().then((logs)=>{
		Cliente.find().then((clientes)=>{
			Ligacao.find().then((ligacoes)=>{
				if(req.user.setor == "administrativo"){ // caso o usuario seija admin ele é encaminhado para a pagina de adm
						const usuarioLogado = new Usuario({
								nome: req.user.nome,
								email: req.user.email,
								cpf: req.user.cpf,
								endereco: req.user.endereco,
								celular: req.user.celular,
								setor: req.user.setor,
								senha: req.user.senha

						})

							res.render('pagina_adm',{usuarioLogado: usuarioLogado, ligacoes: ligacoes, clientes: clientes,logs :logs})
						
					}else{ // caso contrario é enviado para a pagina de usuario comun
						const usuarioLogado = new Usuario({
								nome: req.user.nome,
								email: req.user.email,
								cpf: req.user.cpf,
								endereco: req.user.endereco,
								celular: req.user.celular,
								setor: req.user.setor,
								senha: req.user.senha

						})

							res.render('pagina_usuario',{usuarioLogado: usuarioLogado, ligacoes: ligacoes, clientes: clientes,logs:logs})
						
					}		
			})
		})
	})
	
})


router.post("/login",(req,res,next)=>{ // rota que realiza o login
	passport.authenticate("local",{
		successRedirect: "/usuario/pagina",
		failureRedirect: "/admin",
		failureFlash: true
	})(req,res,next)
})



router.post('/add_cliente',(req,res)=>{ // rota para adicionar um cliente
	
	const novoCliente =  new Cliente({
		nome: req.body.nome_cliente,
		email: req.body.email_cliente,
		cpf: req.body.cpf_cliente,
		celular: req.body.celular_cliente,
		endereco: req.body.endereco_cliente,
		vendedor: req.body.vendedor,
		status_suporte: "ativo"

	}).save()
	const novoLog =  new Log({
		usuario : req.user.nome,
		informacao : "adicionou um o clinte ",
		cadastro: req.body.nome_cliente

	}).save()

	res.redirect('/usuario/pagina')
})


router.post('/add_ligacao',(req,res)=>{ //rota para adicionar um cliente
	var op_en = req.body.operadora_entrada
	var op_sa = req.body.operadora_saida
	var custo_en, custo_sa;

	if (op_en == 'oi'){
		custo_en = 1.2;
	}
	if (op_en == 'vivo'){
		custo_en = 0.8;
	}
	if (op_en == 'claro'){
		custo_en = 1;
	}
	if (op_en == 'tim'){
		custo_en = 0.9;
	}
	if (op_sa == 'oi'){
		custo_sa = 1.2;
	}
	if (op_sa == 'vivo'){
		custo_sa = 0.8;
	}
	if (op_sa == 'claro'){
		custo_sa = 1;
	}
	if (op_sa == 'tim'){
		custo_sa = 0.9;
	}
	var tempo = req.body.tempo
	var custo_total  = 0
	custo_total = (custo_sa * (tempo*0.5)) +(custo_sa *(tempo*0.5)) 
	
	const novaLigacao =  new Ligacao({
		numero_entrada : req.body.numero_entrada,
		numero_saida : req.body.numero_saida,
		op_entrada : req.body.operadora_entrada,
		op_saida : req.body.operadora_saida,
		custo  :  custo_total
	}).save()
	const novoLog =  new Log({
		usuario : req.user.nome,
		informacao : "adicionou uma nova Ligação ",
		cadastro: " "

	}).save()

	res.redirect('/usuario/pagina')
})


router.get('/deletar_cliente/:id',(req,res)=>{ // rota que delata um cliente
	Cliente.findOne({_id: req.params.id}).then((cliente)=>{
		const novoLog =  new Log({
			usuario : req.user.nome,
			informacao : "deletou o cliente",
			cadastro: cliente.nome

		}).save()
	})
	
	Cliente.remove({_id:req.params.id}).then(()=>{
		res.redirect('/usuario/pagina')
	})
	const novoLog =  new Log({
		usuario : req.user.nome,
		informacao : "adicionou um o clinte ",
		cadastro: req.body.nome_cliente

	}).save()
})



router.get('/editar_cliente/:id',(req,res)=>{ //rota que encaminha para o formulário para editar o cliente
	id = req.params.id
	Cliente.findOne({_id: req.params.id}).then((cliente)=>{
		const novoLog =  new Log({
			usuario : req.user.nome,
			informacao : "editou o cadastro ",
			cadastro: cliente.nome

		}).save()
		res.render('editar_cliente', {cliente:cliente, id : id})
	})
})


router.post('/editar_cliente',(req,res)=>{ //rota que edita o cliente
	
	Cliente.findOne({_id: req.body.id}).then((cliente)=>{
		
		cliente.nome = req.body.nome_cliente
		cliente.email = req.body.email_cliente
		cliente.cpf = req.body.cpf_cliente
		cliente.celular = req.body.celular_cliente
		cliente.endereco = req.body.endereco_cliente
		cliente.vendedor = req.body.vendedor
		cliente.status_suporte = req.body.status_suporte

		cliente.save().then(()=>{
			res.redirect('/usuario/pagina')
		})
	})
})

router.get('/editar_ligacao/:id',(req,res)=>{ //rota que encaminha para o formulário para editar a ligação
	id = req.params.id
	Ligacao.findOne({_id: req.params.id}).then((ligacao)=>{
		const novoLog =  new Log({
			usuario : req.user.nome,
			informacao : "editou uma ligação ",
			cadastro: " "

		}).save()
		res.render('editar_ligacao', {ligacao:ligacao, id : id})
	})
})


router.post('/editar_ligacao',(req,res)=>{ // rota que edita uma ligação
	var op_en = req.body.operadora_entrada
	var op_sa = req.body.operadora_saida
	var custo_en, custo_sa;

	if (op_en == 'oi'){
		custo_en = 1.2;
	}
	if (op_en == 'vivo'){
		custo_en = 0.8;
	}
	if (op_en == 'claro'){
		custo_en = 1;
	}
	if (op_en == 'tim'){
		custo_en = 0.9;
	}
	if (op_sa == 'oi'){
		custo_sa = 1.2;
	}
	if (op_sa == 'vivo'){
		custo_sa = 0.8;
	}
	if (op_sa == 'claro'){
		custo_sa = 1;
	}
	if (op_sa == 'tim'){
		custo_sa = 0.9;
	}
	var tempo = req.body.tempo
	var custo_total  = 0
	custo_total = (custo_sa * (tempo*0.5)) +(custo_sa *(tempo*0.5)) 
	
	Ligacao.findOne({_id: req.body.id}).then((ligacao)=>{
	
		ligacao.numero_entrada = req.body.numero_entrada
		ligacao.numero_saida = req.body.numero_saida
		ligacao.op_entrada = req.body.operadora_entrada
		ligacao.op_saida = req.body.operadora_saida
		ligacao.tempo = req.body.tempo
		ligacao.custo  = custo_total

		ligacao.save().then(()=>{
			
			res.redirect('/usuario/pagina')
		})
	})
})

router.get('/deletar_ligacao/:id',(req,res)=>{ //rota para deletar uma ligação
	
		const novoLog =  new Log({
			usuario : req.user.nome,
			informacao : "deletou uma ligação",
			cadastro: " "

		}).save()
	
	Ligacao.remove({_id:req.params.id}).then(()=>{
		res.redirect('/usuario/pagina')
	})
})

router.get('/editar_usuario/inicio',(req,res)=>{
	
	
	
	Usuario.findOne({_id: req.user._id}).then((usuario)=>{
		
		res.render('editar_usuario', {usuario:usuario})
	})
})


router.post('/editar_usuario',(req,res)=>{ //rota que edita o perfil do usuario logado
	
	Usuario.findOne({_id: req.user._id}).then((usuario)=>{
		
		const novoLog =  new Log({
			usuario : req.user.nome,
			informacao : "editou o usuario ",
			cadastro: usuario.nome

		}).save()
		usuario.nome = req.body.nome
		usuario.email = req.body.email
		usuario.cpf = req.body.cpf
		usuario.celular = req.body.celular
		usuario.endereco = req.body.endereco
		
		

		usuario.save().then(()=>{
			res.redirect('/usuario/pagina')
		}).catch((err)=>{
			res.redirect('/admin')
		})
	})
})

router.get('/sair',(req,res)=>{ //rota de logout do site
	req.logout();
	res.redirect('/admin/')
})
module.exports = router