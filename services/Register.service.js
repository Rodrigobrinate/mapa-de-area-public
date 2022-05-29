require("dotenv-safe").config();
const jwt = require('jsonwebtoken'); 

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ datasources: {  db: { url: "mysql://root:123456@mysqldb:3306/mapa-de-area" } } });

const bcrypt = require('bcryptjs')
exports.register = async (req, res) => { 
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
          return res.status(401).json({
              message: 'Email already in use'
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

        return res.status(401).json({
          message: 'usuário cadastrado com sucesso' })
      }
} 
