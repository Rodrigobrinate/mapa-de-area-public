const express = require('express')
const router = express.Router()
const IndexController = require('./controllers/Index.controller')
const LoginController = require('./controllers/Login.controller')
const RegisterController = require('./controllers/Register.controller')
const MassiveController = require('./controllers/Massive.controller')
const CofeeController = require('./controllers/Cofee.controller')
const EscalaController = require('./controllers/Escala.controller')
const jwtVerify = require('./middleware/jwtVerify')


router.get('/', jwtVerify, IndexController.index)
router.post('/login', LoginController.login)
router.post('/register', RegisterController.register)
router.get('/city',jwtVerify, IndexController.city)
router.get('/colaborator',jwtVerify, IndexController.colaborator)
router.get('/colaborator/:data',jwtVerify, IndexController.searchColaborator)
router.post('/create',jwtVerify,  IndexController.create)
router.post('/search', jwtVerify, IndexController.search)
router.get('/teste', IndexController.teste)
router.post('/delete', jwtVerify, IndexController.delete)
router.post('/createMassive', jwtVerify, MassiveController.createMassive)
router.get('/Massive',jwtVerify, MassiveController.massive)
router.get('/coffee/:id', CofeeController.index)
router.get('/addCoffee',jwtVerify, CofeeController.create) 
router.get('/closeCofee',jwtVerify, CofeeController.delete)
router.post('/admCloseCofee',jwtVerify, CofeeController.admdelete)   
router.post('/createMassiveClient', jwtVerify, MassiveController.createClientMassive)
router.get('/clientMassive', jwtVerify, MassiveController.clientMassiveview)
router.post('/recovery/password',jwtVerify, LoginController.recovery)
router.get('/escala/:id', jwtVerify, EscalaController.index )
router.post('/upescala', jwtVerify, EscalaController.update)
router.post('/createescala', jwtVerify, EscalaController.create)
 
router.get('/escalaSuport/:id', jwtVerify, EscalaController.indexSuport )
router.get('/teste2',  async (req,res)=> {

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });

  const user = await prisma.user.findMany({
    where: {
        department: '1'
    }
  })
  res.json(user.length)
} )






router.get('/t', jwtVerify, (req, res) => {
    res.json(req.user)
})
module.exports = router 