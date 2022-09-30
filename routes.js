const express = require('express')
const router = express.Router()
const IndexController = require('./controllers/Index.controller')
const LoginController = require('./controllers/Login.controller')
const RegisterController = require('./controllers/Register.controller')
const MassiveController = require('./controllers/Massive.controller')
const CofeeController = require('./controllers/Cofee.controller')
const EscalaController = require('./controllers/Escala.controller')
const CitiesController = require("./controllers/Cities.controller")
const UserController = require("./controllers/User.controller")
const jwtVerify = require('./middleware/jwtVerify')


// rotas para o usuario
router.post('/login', UserController.login)
router.post('/register', RegisterController.register)
router.post('/recovery/password',jwtVerify, LoginController.recovery)
router.get('/users/:department',jwtVerify, UserController.users)
router.post('/users/update',jwtVerify, LoginController.update)
router.post('/user/update',jwtVerify, UserController.userUpdate)
router.get('/colaborator',jwtVerify, UserController.user)
router.get('/colaborator/:name',jwtVerify, UserController.serarchUser)
router.get('/user/delete/:id',jwtVerify, UserController.delete)


router.get("/departments", jwtVerify, UserController.departments)


// rotas para o mapa de area
router.get('/', jwtVerify, IndexController.index)
router.get('/teste', IndexController.teste)
router.get('/city',jwtVerify, CitiesController.city)

router.post('/create',jwtVerify,  IndexController.create)
router.post('/search', jwtVerify, IndexController.search)
router.post('/delete', jwtVerify, IndexController.delete)

// rotas para o massivo
router.post('/createMassive', jwtVerify, MassiveController.createMassive)
router.get('/Massive',jwtVerify, MassiveController.massive)
router.post('/createMassiveClient', jwtVerify, MassiveController.createClientMassive)
router.get('/clientMassive', jwtVerify, MassiveController.clientMassiveview)

// rotas para o cofee
router.get('/coffee/', CofeeController.index)
router.get('/addCoffee',jwtVerify, CofeeController.create) 
router.get('/closeCofee',jwtVerify, CofeeController.delete)
router.post('/admCloseCofee',jwtVerify, CofeeController.admdelete)   

// rotas para a escala
router.get('/escala/:id', jwtVerify, EscalaController.index )
router.post('/upescala', jwtVerify, EscalaController.update)
router.post('/createescala', jwtVerify, EscalaController.create)
router.get('/escalaSuport/:id', jwtVerify, EscalaController.indexSuport )



// rotas de teste //////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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