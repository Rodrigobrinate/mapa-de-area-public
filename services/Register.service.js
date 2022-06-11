require("dotenv-safe").config();
const jwt = require('jsonwebtoken'); 

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const bcrypt = require('bcryptjs')
exports.register = async (req, res) => { 


  if (req.body.name == "" || req.body.email == "" || req.body.password == "" || req.body.department == 0) {
res.json({
  status: 0,
  msg: "Preencha todos os campos"
})
}else{



 
    usuario = req.body.email.substring(0, req.body.email.indexOf("@"));
    dominio = req.body.email.substring(req.body.email.indexOf("@")+ 1, req.body.email.length);
    
    if ((usuario.length >=1) && (dominio.length >=3) && (usuario.search("@")==-1) && (dominio.search("@")==-1) && (usuario.search(" ")==-1) && (dominio.search(" ")==-1) && (dominio.search(".")!=-1) && (dominio.indexOf(".") >=1)&& (dominio.lastIndexOf(".") < dominio.length - 1)) {
    
    
    


    const name = req.body.name
    const email = req.body.email 
    const password = req.body.password
    const accessLevel = req.body.department
    const department = req.body.department
    const user_verify = await prisma.user.findUnique({
        where: {
          email: email,
        }
      })
      if(user_verify){
          return res.json({
            st: 0,
            msg: 'Email já utilizado'
          })
      }else{
          
    console.log(name, email, password,accessLevel,department)
        const passwordHash = bcrypt.hashSync(password, 10)

        await prisma.user.create({
            data: {
            name: name,   
            email: email, 
            password: passwordHash,   
            access_level: parseInt(accessLevel), 
            department: department
        } 
        }) 

        return res.json({
          st: 1,
          msg: 'usuário cadastrado com sucesso' })
      }
  }
    else{
      res.json({
        status: 0, 
        msg: "email inválido"
      })


    }  }
} 
