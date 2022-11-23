const express = require('express')
const router = express.Router()
const IndexController = require('./controllers/Index.controller')
//const LoginController = require('./controllers/Login.controller')

const MassiveController = require('./controllers/Massive.controller')
const CitiesController = require("./controllers/Cities.controller")
const UserController = require("./controllers/User.controller")
const jwtVerify = require('./middleware/jwtVerify')
const { index } = require('./repositories/index.repository')


// rotas para o usuario
router.post('/login', UserController.login)
router.post('/register', UserController.create)
//router.post('/recovery/password',jwtVerify, LoginController.recovery)
router.get('/users/:department',jwtVerify, UserController.users)
router.post('/users/update',jwtVerify, UserController.update)
router.post('/user/update',jwtVerify, UserController.userUpdate)
router.get('/colaborator',jwtVerify, UserController.user)
router.get('/colaborator/:name',jwtVerify, UserController.serarchUser)
router.get('/user/delete/:id',jwtVerify, UserController.delete)



router.get("/departments", jwtVerify, UserController.departments)


// rotas para o mapa de area
router.get('/', jwtVerify, IndexController.index)
router.get('/teste', IndexController.teste)
router.get('/city',jwtVerify, CitiesController.city)
router.put('/userInWork/editType',jwtVerify, IndexController.EditType)
router.put('/userInWork/editPeriod',jwtVerify, IndexController.EditPeriod)
router.put('/userInCity/update',jwtVerify, IndexController.Update)
router.get('/login', IndexController.login)
router.get('/agenda/:id', IndexController.getAgenda)
router.post('/alert/create', jwtVerify,IndexController.alertCreate)
router.post('/city/serach', jwtVerify,IndexController.cities_seach) 

router.put("/alert/edit", jwtVerify, IndexController.alertUpdate)
router.delete("/alert/delete/:id", jwtVerify,IndexController.alertDelete)

router.post('/create',jwtVerify,  IndexController.create)
router.post('/colaborator/createMany',jwtVerify,  IndexController.createMany)
router.post('/search', jwtVerify, IndexController.search)
router.post('/delete', jwtVerify, IndexController.delete)

// rotas para o massivo
router.post('/createMassive', jwtVerify, MassiveController.createMassive)
router.get('/Massive',jwtVerify, MassiveController.massive)
router.post('/createMassiveClient', jwtVerify, MassiveController.createClientMassive)
router.get('/clientMassive', jwtVerify, MassiveController.clientMassiveview)




module.exports = router 