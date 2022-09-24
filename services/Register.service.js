require("dotenv-safe").config();
const jwt = require('jsonwebtoken'); 

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });

const bcrypt = require('bcryptjs')

// registra um usuario
exports.register = async (req, res) => { 

  let { name, email, password, } = req.body;
  var a = email == null
  var b = password == null
  var c = name == null
  var e = email ==   ""   
  var f = name ==   ""   
  var g = password ==   ""    
  var i = email ==  undefined
  var j = password ==  undefined
  var k = name ==  undefined


    // validacao de campos
  if(a || b || c || e || f || g || i || j || k ){
    res.status(406).json({status: 0,msg: "Preencha todos os campos"})
  }else{
    //verifica o tamano da senha
    if (password.length <= 7){
      res.status(406).json({status: 0,msg: "sua senha deve ter no minimo 8 caracteres"})
    }else {
      usuario = req.body.email.substring(0, req.body.email.indexOf("@"));
      dominio = req.body.email.substring(req.body.email.indexOf("@")+ 1, req.body.email.length);
        //verifica se o email e valido
      if ((usuario.length >=1) && 
      (dominio.length >=3) && (usuario.search("@")==-1) && 
      (dominio.search("@")==-1) && (usuario.search(" ")==-1) && 
      (dominio.search(" ")==-1) && (dominio.search(".")!=-1) && 
      (dominio.indexOf(".") >=1)&& (dominio.lastIndexOf(".") < dominio.length - 1)) {

        const user_verify = await prisma.user.findUnique({
          where: {
            email: email,
          }
        }).then(async (response) => {
        

        //verifica se o email ja existe
        if(response){
            return res.status(406).json({st: 0,msg: 'Email já utilizado'})
        }else{
          const passwordHash = bcrypt.hashSync(password, 10);
          await prisma.user.create({
              data: {
              name: name,   
              email: email, 
              password: passwordHash,
              department_id: 1   
            } 
          }).then((response) => {
            return res.status(200).json({st: 1,msg: 'usuário cadastrado com sucesso' })
          }).catch((err) => {
            res.status(500).json({msg: 'ocorreu um erro contate o suporte', err}) 
          })
        }}).catch((err) => {
          res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
        })
    }else{
          res.status(406).json({status: 0, msg: "email inválido"})
      }  
  }

}

}
