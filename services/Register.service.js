require("dotenv-safe").config();
const jwt = require('jsonwebtoken'); 

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });

const bcrypt = require('bcryptjs')
exports.register = async (req, res) => { 

  let { name, email, password, department, } = req.body;
  var a = email == null
  var b = password == null
  var c = name == null
  var d = department == null
  var e = email ==   ""   
  var f = name ==   ""   
  var g = password ==   ""   
  var h = department ==  ""   
  var i = email ==  undefined
  var j = password ==  undefined
  var k = name ==  undefined
  var l = department ==  undefined

  if(a || b || c || d || e || f || g || h || i || j || k || l){
    res.json({status: 0,msg: "Preencha todos os campos"})
  }else{
    if (password.length <= 7){
      console.log(password.length) 
      res.json({status: 0,msg: "sua senha deve ter no minimo 8 caracteres"})

    }else {
      usuario = req.body.email.substring(0, req.body.email.indexOf("@"));
      dominio = req.body.email.substring(req.body.email.indexOf("@")+ 1, req.body.email.length);
      
      if ((usuario.length >=1) && 
      (dominio.length >=3) && (usuario.search("@")==-1) && 
      (dominio.search("@")==-1) && (usuario.search(" ")==-1) && 
      (dominio.search(" ")==-1) && (dominio.search(".")!=-1) && 
      (dominio.indexOf(".") >=1)&& (dominio.lastIndexOf(".") < dominio.length - 1)) {
        const user_verify = await prisma.user.findUnique({
          where: {
            email: email,
          }
        })
        if(user_verify){
            return res.json({st: 0,msg: 'Email já utilizado'})
        }else{
          const passwordHash = bcrypt.hashSync(password, 10);
          await prisma.user.create({
              data: {
              name: name,   
              email: email, 
              password: passwordHash,   
              access_level: 1, 
              department: department
            } 
          }) 
          return res.json({st: 1,msg: 'usuário cadastrado com sucesso' })
        }
    }
      else{
          res.json({status: 0, msg: "email inválido"})
      }  
  }
}

}
